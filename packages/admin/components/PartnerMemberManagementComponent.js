import {
  AvatarComponent,
  UserStatusComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  ReactTableLayout,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import { STATUS } from '@revtech/rev-shared/enums';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createLink } from '@revtech/rev-shared/libs';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React from 'react';

import { getMemberList } from '@revtech/rev-shared/apis/actions';
import {
  partnerMembersSelector,
  partnerMembersErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import AuthenHOC from './HOC/AuthenHOC';
import { Grid, Typography } from '@material-ui/core';

const { U_PENDING } = STATUS;
const connectToRedux = connect(
  createStructuredSelector({
    partnerMembers: partnerMembersSelector,
    errorMessages: partnerMembersErrorSelector
  }),
  dispatch => ({
    getMemberList: partnerId => {
      dispatch(getMemberList(partnerId));
    }
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation('react-table'),
  AuthenHOC
);

const mapPartnerMembersToDataField = ({ partnerMembers = [], t }) =>
  partnerMembers.map((partnerMember, index) => ({
    id: index + 1,
    name: (
      <Grid container alignItems="center" direction="row">
        <AvatarComponent small />
        <span>&nbsp;&nbsp;</span>
        {partnerMember.status === U_PENDING ? (
          <a>{partnerMember.fullName}</a>
        ) : (
          <Link
            href={createLink([
              'partner',
              'users',
              `details?id=${partnerMember.id}`
            ])}
          >
            <a>{partnerMember.fullName}</a>
          </Link>
        )}
      </Grid>
    ),
    username: partnerMember.username,
    partnerId: partnerMember.partner
      ? partnerMember.partner.partnerId
      : 'Not defined yet',
    joinDate: (
      <Moment format={DATE_TIME_FORMAT}>{partnerMember.createdAt}</Moment>
    ),
    email: partnerMember.email,
    role: partnerMember.role,
    status: <UserStatusComponent t={t} status={partnerMember.status} />
  }));

class PartnerMemberManagementComponent extends React.Component {
  render() {
    const {
      partnerMembers = [],
      t,
      getMemberList,
      partnerId,
      errorMessages
    } = this.props;
    const COLUMNS = [
      {
        field: 'id',
        title: t('table.members_management.header.id')
      },
      {
        field: 'name',
        title: t('table.members_management.header.member_name')
      },
      {
        field: 'username',
        title: t('table.members_management.header.member_username')
      },
      {
        field: 'partnerId',
        title: t('table.members_management.header.partner_id')
      },
      {
        field: 'joinDate',
        title: t('table.members_management.header.join_date')
      },
      {
        field: 'email',
        title: t('table.members_management.header.email')
      },
      {
        field: 'role',
        title: t('table.members_management.header.role')
      },
      {
        field: 'status',
        title: t('table.members_management.header.status')
      }
    ];
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <Grid xs={12} item className="shadow-0">
          <CardSimpleLayout
            header={
              <Grid container justify="space-between" alignItems="center">
                <Typography variant="h6">
                  {t('table.members_management.title')}
                </Typography>
              </Grid>
            }
            body={
              <ReactTableLayout
                style={{ boxShadow: 'none' }}
                pageSize={5}
                hasAction={false}
                data={mapPartnerMembersToDataField({ partnerMembers, t })}
                dispatchAction={() => getMemberList(partnerId)}
                columns={COLUMNS}
                t={t}
              />
            }
            bodyStyle={{
              padding: 0
            }}
          />
        </Grid>
      </React.Fragment>
    );
  }
}

export default enhance(PartnerMemberManagementComponent);
