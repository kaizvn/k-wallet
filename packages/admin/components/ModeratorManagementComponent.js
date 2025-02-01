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
  DATEFORMAT,
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
  banUser,
  unbanUser,
  getQuickFilterModeratorList,
  getQuickFilterModeratorListSelector,
  getQuickFilterModeratorListErrorSelector
} from '../stores/AdminState';
import { LockOpen, Lock } from '@material-ui/icons';
import { Grid } from '@material-ui/core';

const { U_ACTIVE, U_BANNED } = STATUS;
const { U_BAN, U_UNBAN } = APP_ACTIONS;

const isModerator = true;

const connectToRedux = connect(
  createStructuredSelector({
    moderatorsFiltered: getQuickFilterModeratorListSelector,
    errorMessages: getQuickFilterModeratorListErrorSelector
  }),
  dispatch => ({
    getModeratorList: (
      page,
      pageSize,
      filterText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterModeratorList({
            page,
            pageSize,
            filterContents: filterText.trim(),
            dateRange
          })
        );
    },
    banUser: id => dispatch(banUser(id, isModerator)),
    unbanUser: id => dispatch(unbanUser(id, isModerator))
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

const getMemberManagementActions = (user, { banUser, unbanUser, t }) => {
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

const mapModeratorsToDataField = ({ moderators = [], banUser, unbanUser, t }) =>
  moderators.map(moderator => ({
    fullName: (
      <Grid container alignItems="center" direction="row">
        <AvatarComponent small url={moderator.avatar} />
        <span>&nbsp;&nbsp;</span>
        <Link href={createLink(['moderators', `details?id=${moderator.id}`])}>
          <a>
            <InformationComponent>{moderator.fullName} </InformationComponent>
          </a>
        </Link>
      </Grid>
    ),
    email: moderator.email,
    dateCreate: <Moment format={DATEFORMAT}>{moderator.createdAt}</Moment>,
    status: <UserStatusComponent t={t} status={moderator.status} />,
    action: getMemberManagementActions(moderator, {
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

class ModeratorManagementComponent extends React.Component {
  render() {
    const {
      banUser,
      unbanUser,
      getModeratorList,
      moderatorsFiltered,
      setSearchMessage,
      searchMessage,
      t,
      dateRange,
      setDateRange,
      errorMessages
    } = this.props;

    let renderModerators = [];
    let totalCount = 0,
      page = 0,
      pageSize = 10;
    if (moderatorsFiltered) {
      renderModerators = moderatorsFiltered.users;
      totalCount = moderatorsFiltered.pageInfos.totalCount;
      page = moderatorsFiltered.pageInfos.filter.page;
      pageSize = moderatorsFiltered.pageInfos.filter.pageSize;
    }
    const COLUMNS = [
      {
        field: 'fullName',
        title: t('table.moderator_manage.header.fullname')
      },
      {
        field: 'email',
        title: t('table.moderator_manage.header.email')
      },
      {
        field: 'dateCreate',
        title: t('table.moderator_manage.header.date_create')
      },
      {
        field: 'status',
        title: t('table.moderator_manage.header.status')
      },
      {
        field: 'action',
        title: t('table.moderator_manage.header.action')
      }
    ];
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <FrameHeaderComponent title={t('table.moderator_manage.title')}>
          <Button onClick={() => Router.push('/moderators/add')}>
            {t('add')}
          </Button>
        </FrameHeaderComponent>
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.moderator_manage.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapModeratorsToDataField({
            moderators: renderModerators,
            banUser,
            unbanUser,
            t
          })}
          columns={COLUMNS}
          dispatchAction={getModeratorList}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          t={t}
        />
      </React.Fragment>
    );
  }
}

export default enhance(ModeratorManagementComponent);
