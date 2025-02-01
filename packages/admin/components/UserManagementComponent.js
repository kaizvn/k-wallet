import { APP_ACTIONS, STATUS } from '@revtech/rev-shared/enums';
import {
  AvatarComponent,
  FrameHeaderComponent,
  UserStatusComponent,
  DisplayErrorMessagesComponent,
  ButtonActionTableComponent
} from '@revtech/rev-shared/components';
import { Button, ReactTableLayout } from '@revtech/rev-shared/layouts';
import {
  DATE_TIME_FORMAT,
  InformationComponent,
  getLabelByActionWithT,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createLink } from '@revtech/rev-shared/libs';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  approveUser,
  banUser,
  rejectUser,
  unbanUser,
  getQuickFilterUsersList,
  getQuickFilterUsersListSelector,
  getQuickFilterUsersListErrorSelector
} from '../stores/AdminState';
import { Lock, AssignmentTurnedIn, Cancel, LockOpen } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

const { U_ACTIVE, U_BANNED, U_PENDING } = STATUS;
const { U_APPROVE, U_BAN, U_REJECT, U_UNBAN } = APP_ACTIONS;

const connectToRedux = connect(
  createStructuredSelector({
    usersFiltered: getQuickFilterUsersListSelector,
    errorMessages: getQuickFilterUsersListErrorSelector
  }),
  dispatch => ({
    getUserList: (
      page,
      pageSize,
      filterText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterUsersList({
            page,
            pageSize,
            filterContents: filterText.trim(),
            dateRange
          })
        );
    },
    approveUser: id => dispatch(approveUser(id)),
    rejectUser: id => dispatch(rejectUser(id)),
    banUser: id => dispatch(banUser(id)),
    unbanUser: id => dispatch(unbanUser(id))
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
  withTranslation(['react-table', 'common'])
);

const getMemberManagementActions = (
  user,
  { approveUser, rejectUser, banUser, unbanUser, t }
) => {
  switch (user.status) {
    case U_ACTIVE: {
      return [
        {
          label: getLabelByActionWithT({ action: U_BAN, t }),
          action: () => {
            banUser(user.id);
          },
          icon: <Lock />
        }
      ];
    }
    case U_PENDING: {
      return [
        {
          label: getLabelByActionWithT({ action: U_APPROVE, t }),
          action: () => {
            approveUser(user.id);
          },
          icon: <AssignmentTurnedIn />
        },
        {
          label: getLabelByActionWithT({ action: U_REJECT, t }),
          action: () => {
            rejectUser(user.id);
          },
          icon: <Cancel />
        }
      ];
    }
    case U_BANNED: {
      return [
        {
          label: getLabelByActionWithT({ action: U_UNBAN, t }),
          action: () => {
            unbanUser(user.id);
          },
          icon: <LockOpen />
        }
      ];
    }
    default:
      return [];
  }
};

const mapUsersToDataField = ({
  users = [],
  approveUser,
  rejectUser,
  banUser,
  unbanUser,
  t
}) =>
  users.map(user => ({
    fullName: (
      <Grid container alignItems="center" direction="row">
        <AvatarComponent small url={user.avatar} />
        <span>&nbsp;&nbsp;</span>
        <Link href={createLink(['users', `details?id=${user.id}`])}>
          <a>
            <InformationComponent>{user.fullName} </InformationComponent>
          </a>
        </Link>
      </Grid>
    ),
    email: user.email,
    dateCreate: <Moment format={DATE_TIME_FORMAT}>{user.createdAt}</Moment>,
    status: <UserStatusComponent t={t} status={user.status} />,
    action: getMemberManagementActions(user, {
      approveUser,
      rejectUser,
      banUser,
      unbanUser,
      t
    }).map(({ label, action, icon }, index) => (
      <ButtonActionTableComponent
        key={index}
        label={label}
        action={action}
        icon={icon}
      />
    ))
  }));

class UserManagementComponent extends React.Component {
  render() {
    const {
      approveUser,
      rejectUser,
      banUser,
      unbanUser,
      getUserList,
      usersFiltered,
      setSearchMessage,
      searchMessage,
      t,
      dateRange,
      setDateRange,
      errorMessages
    } = this.props;

    let renderUsers = [];
    let totalCount = 0,
      page = 0,
      pageSize = 10;
    if (usersFiltered) {
      renderUsers = usersFiltered.users;
      totalCount = usersFiltered.pageInfos.totalCount;
      page = usersFiltered.pageInfos.filter.page;
      pageSize = usersFiltered.pageInfos.filter.pageSize;
    }
    const COLUMNS = [
      {
        field: 'fullName',
        title: t('table.user_manage.header.fullname')
      },
      {
        field: 'email',
        title: t('table.user_manage.header.email')
      },
      {
        field: 'dateCreate',
        title: t('table.user_manage.header.date_create')
      },
      {
        field: 'status',
        title: t('table.user_manage.header.status')
      },
      {
        field: 'action',
        title: t('table.user_manage.header.action')
      }
    ];
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <FrameHeaderComponent title={t('table.user_manage.title')}>
          <Button onClick={() => Router.push('/users/add')}>{t('add')}</Button>
        </FrameHeaderComponent>
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.user_manage.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapUsersToDataField({
            users: renderUsers,
            approveUser,
            rejectUser,
            banUser,
            unbanUser,
            t
          })}
          columns={COLUMNS}
          dispatchAction={getUserList}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          t={t}
        />
      </React.Fragment>
    );
  }
}

export default enhance(UserManagementComponent);
