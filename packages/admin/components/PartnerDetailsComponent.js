import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import {
  PartnerStatusComponent,
  MissingInfoComponent
} from '@revtech/rev-shared/components';
import {
  InfoLayout,
  Button,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { STATUS } from '@revtech/rev-shared/enums';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  getPartnerDetailsSelector,
  approvePartner,
  banPartner,
  unbanPartner,
  getPartnerDetailsAPI,
  rejectPartner
} from '../stores/AdminState';
import PartnerMemberManagementComponent from './PartnerMemberManagementComponent';
import PartnerWalletsComponent from './PartnerWalletsComponent';
import { Grid, Typography, Divider } from '@material-ui/core';

const { P_ACTIVE, P_BANNED, P_PENDING } = STATUS;

const connectToRedux = connect(
  createStructuredSelector({
    partner: getPartnerDetailsSelector
  }),
  dispatch => ({
    getPartnerDetails: id => dispatch(getPartnerDetailsAPI(id)),
    approvePartner: id => dispatch(approvePartner(id)),
    rejectPartner: id => dispatch(rejectPartner(id)),
    banPartner: id => dispatch(banPartner(id)),
    unbanPartner: id => dispatch(unbanPartner(id))
  })
);

const enhance = compose(connectToRedux, withTranslation(['partner', 'common']));

class PartnerDetailsComponent extends React.Component {
  componentDidMount() {
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

    const rows = [
      { label: t('detail.partner_details.label.id'), key: 'id' },
      { label: t('detail.partner_details.label.name'), key: 'name' },
      { label: t('detail.partner_details.label.phone'), key: 'phone' },
      { label: t('detail.partner_details.label.address'), key: 'address' },
      { label: t('detail.partner_details.label.owner_name'), key: 'ownerName' },
      {
        label: t('detail.partner_details.label.owner_username'),
        key: 'ownerUsername'
      },
      {
        label: t('detail.partner_details.label.owner_email'),
        key: 'ownerEmail'
      },
      { label: t('detail.partner_details.label.status'), key: 'status' },
      { label: t('detail.partner_details.label.join_date'), key: 'joinDate' }
    ];
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
      <MissingInfoComponent>
        <Typography variant="h5" color="secondary">
          {t('common:rev_shared.message.not_found_user')}
        </Typography>
      </MissingInfoComponent>
    ) : (
      <Grid>
        <Grid container justify="center">
          <Grid xs={12} item className="shadow-0">
            <CardSimpleLayout
              header={
                <Grid container justify="space-between" alignItems="center">
                  <Typography variant="h6">
                    {t('detail.partner_details.title')}
                  </Typography>

                  {partner.status === P_ACTIVE && (
                    <Button
                      type="submit"
                      onClick={() => banPartner(partner.id)}
                    >
                      {t('common:actions_button.ban')}
                    </Button>
                  )}
                  {partner.status === P_BANNED && (
                    <Button
                      type="submit"
                      onClick={() => unbanPartner(partner.id)}
                    >
                      {t('common:actions_button.unban')}
                    </Button>
                  )}
                  {partner.status === P_PENDING && (
                    <React.Fragment>
                      <Button
                        type="submit"
                        onClick={() => approvePartner(partner.id)}
                      >
                        {t('common:actions_button.approve')}
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => rejectPartner(partner.id)}
                      >
                        {t('common:actions_button.reject')}
                      </Button>
                    </React.Fragment>
                  )}
                </Grid>
              }
              body={
                <InfoLayout
                  title="Profile Info"
                  subtitle=""
                  rows={rows}
                  displays={displays}
                />
              }
            />
          </Grid>
        </Grid>
        <Divider style={{ margin: '40px 0px' }} />
        <PartnerMemberManagementComponent partnerId={Router.query.id} />
        <PartnerWalletsComponent partnerId={Router.query.id} />
      </Grid>
    );
  }
}

export default enhance(PartnerDetailsComponent);
