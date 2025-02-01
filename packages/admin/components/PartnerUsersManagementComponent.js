import {
  AvatarComponent,
  FrameHeaderComponent,
  UserStatusComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  DATE_TIME_FORMAT,
  InformationComponent,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createLink } from '@revtech/rev-shared/libs';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React from 'react';

import {
  getQuickFilterPartnerUsersList,
  quickFilterPartnerUserListSelector,
  getQuickFilterPartnerUserListErrorSelector
} from '../stores/AdminState';
import { Grid } from '@material-ui/core';

const connectToRedux = connect(
  createStructuredSelector({
    partnerUsersData: quickFilterPartnerUserListSelector,
    errorMessages: getQuickFilterPartnerUserListErrorSelector
  }),
  dispatch => ({
    getPartnerList: (
      page,
      pageSize,
      searchText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterPartnerUsersList({
            page,
            pageSize,
            filterContents: searchText.trim(),
            dateRange
          })
        );
    }
  })
);

const withSearchMessageState = withState(
  'searchMessage',
  'setSearchMessage',
  ''
);

const withDateRangeState = withState(
  'dateRange',
  'setDateRange',
  DEFAULT_DATE_RANGE
);

const enhance = compose(
  withSearchMessageState,
  withDateRangeState,
  connectToRedux,
  withTranslation('react-table')
);

const mapPartnerUsersListToDataField = ({ partnerUsers = [], t }) =>
  partnerUsers.map(partnerUser => ({
    fullname: (
      <Grid container alignItems="center" direction="row">
        <AvatarComponent small />
        <span>&nbsp;&nbsp;</span>
        {partnerUser.fullName === partnerUser.email ? (
          <a>
            <InformationComponent>{partnerUser.fullName}</InformationComponent>
          </a>
        ) : (
          <Link
            href={createLink([
              'partner',
              'users',
              `details?id=${partnerUser.id}`
            ])}
          >
            <a>
              <InformationComponent>
                {partnerUser.fullName}
              </InformationComponent>
            </a>
          </Link>
        )}
      </Grid>
    ),
    email: partnerUser.email,
    partnerName: (
      <InformationComponent>{partnerUser.partner.name}</InformationComponent>
    ),
    role: partnerUser.role,
    joinDate: (
      <Moment format={DATE_TIME_FORMAT}>{partnerUser.createdAt}</Moment>
    ),
    status: <UserStatusComponent t={t} status={partnerUser.status} />
  }));

class PartnerUsersManagementComponent extends React.Component {
  render() {
    const {
      partnerUsersData,
      getPartnerList,
      setSearchMessage,
      t,
      dateRange,
      setDateRange,
      searchMessage,
      errorMessages
    } = this.props;
    let partnerUsers = [],
      totalCount = 0,
      page = 0,
      pageSize = 10;
    if (partnerUsersData) {
      partnerUsers = partnerUsersData.partnerUsers;
      totalCount = partnerUsersData.pageInfos.totalCount;
      page = partnerUsersData.pageInfos.filter.page;
      pageSize = partnerUsersData.pageInfos.filter.pageSize;
    }
    const COLUMNS = [
      {
        field: 'fullname',
        title: t('table.partner_user.header.fullname')
      },
      {
        field: 'email',
        title: t('table.partner_user.header.email')
      },
      {
        field: 'partnerName',
        title: t('table.partner_user.header.partner_name')
      },
      {
        field: 'role',
        title: t('table.partner_user.header.role')
      },
      {
        field: 'joinDate',
        title: t('table.partner_user.header.join_date')
      },
      {
        field: 'status',
        title: t('table.partner_user.header.status')
      }
    ];
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <FrameHeaderComponent title={t('table.partner_user.title')} />
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.partner_user.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapPartnerUsersListToDataField({ partnerUsers, t })}
          columns={COLUMNS}
          dispatchAction={getPartnerList}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          t={t}
        />
      </React.Fragment>
    );
  }
}

export default enhance(PartnerUsersManagementComponent);
