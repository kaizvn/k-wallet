import { Button, InfoLayout } from '@revtech/rev-shared/layouts';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import {
  FrameComponent,
  FrameHeaderComponent,
  PartnerStatusComponent
} from '@revtech/rev-shared/components';
import { STATUS } from '@revtech/rev-shared/enums';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  GetPartnerDetailsSelector,
  approvePartner,
  banPartner,
  unbanPartner,
  getPartnerDetailsAPI,
  rejectPartner
} from '../stores/AdminState';
import PartnerMemberManagementComponent from './PartnerMemberManagementComponent';

const { P_ACTIVE, P_PENDING, P_SUSPENDED } = STATUS;
const connectToRedux = connect(
  createStructuredSelector({
    partner: GetPartnerDetailsSelector
  }),
  dispatch => ({
    getPartnerDetails: id => dispatch(getPartnerDetailsAPI(id)),
    approvePartner: id => dispatch(approvePartner(id)),
    rejectPartner: id => dispatch(rejectPartner(id)),
    banPartner: id => dispatch(banPartner(id)),
    unbanPartner: id => dispatch(unbanPartner(id))
  })
);

const rows = [
  { label: 'ID', key: 'id' },
  { label: 'Name', key: 'name' },
  { label: 'Phone', key: 'phone' },
  { label: 'Address', key: 'address' },
  { label: 'Owner Name', key: 'ownerName' },
  { label: 'Owner Username', key: 'ownerUsername' },
  { label: 'Owner Email', key: 'ownerEmail' },
  { label: 'Status', key: 'status' },
  { label: 'Join Date', key: 'joinDate' }
];

class PartnerDetailsComponent extends React.Component {
  componentWillMount() {
    this.props.getPartnerDetails(Router.query.id);
  }
  render() {
    const {
      partner,
      approvePartner,
      rejectPartner,
      banPartner,
      unbanPartner,
      t
    } = this.props;

    const displays = partner
      ? {
          id: partner.partnerId,
          name: partner.name,
          phone: partner.phone,
          address: partner.address,
          ownerName: partner.owner ? partner.owner.fullName : 'Not defined yet',
          ownerUsername: partner.owner
            ? partner.owner.username
            : 'Not defined yet',
          ownerEmail: partner.owner ? partner.owner.email : 'Not defined yet',
          status: <PartnerStatusComponent t={t} status={partner.status} />,
          joinDate: (
            <Moment format={DATE_TIME_FORMAT}>{partner.createdAt}</Moment>
          )
        }
      : null;

    return !partner ? (
      <div />
    ) : (
      <FrameComponent
        extraComponent={
          <React.Fragment>
            <hr />
            <PartnerMemberManagementComponent
              partnerId={Router.query.id}
              partnerStatus={partner.status}
            />
          </React.Fragment>
        }
      >
        <FrameHeaderComponent title="Partner Details">
          {partner.status === P_ACTIVE && (
            <Button
              className="btn btn-block btn-royal-blue"
              type="submit"
              onClick={() => banPartner(partner.id)}
            >
              Ban
            </Button>
          )}
          {partner.status === P_SUSPENDED && (
            <Button
              className="btn btn-block btn-royal-blue"
              type="submit"
              onClick={() => unbanPartner(partner.id)}
            >
              Unban
            </Button>
          )}
          {partner.status === P_PENDING && (
            <React.Fragment>
              <Button
                className="btn btn-block btn-royal-blue"
                type="submit"
                onClick={() => approvePartner(partner.id)}
              >
                Approve
              </Button>
              <Button
                className="btn btn-block btn-royal-blue"
                type="button"
                danger
                onClick={() => rejectPartner(partner.id)}
              >
                Reject
              </Button>
            </React.Fragment>
          )}
        </FrameHeaderComponent>
        <div className="card-block table-responsive">
          <InfoLayout
            title="Profile Info"
            subtitle=""
            rows={rows}
            displays={displays}
          />
        </div>
      </FrameComponent>
    );
  }
}

export default connectToRedux(PartnerDetailsComponent);
