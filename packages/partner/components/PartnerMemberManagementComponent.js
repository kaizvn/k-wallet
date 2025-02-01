import {
  AvatarComponent,
  FrameHeaderComponent,
  InviteComponent,
  UserStatusComponent,
  ButtonActionTableComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  DATE_TIME_FORMAT,
  getLabelByActionWithT,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { STATUS, ACCOUNT_ROLES, APP_ACTIONS } from '@revtech/rev-shared/enums';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import {
  copyToClipboard,
  createLink,
  objToQueryString
} from '@revtech/rev-shared/libs';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React, { Fragment } from 'react';

import {
  approveMember,
  banMember,
  cancelMemberInvitation,
  getQuickFilterMemberList,
  getQuickFilterPartnerMembersSelector,
  sendInviteToMemberErrorSelector,
  rejectMember,
  sendInviteToMember,
  unbanMember
} from '../stores/PartnerState';
import AuthenHOC from './HOC/AuthenHOC';
import {
  Replay,
  FileCopy,
  Cancel,
  AssignmentTurnedIn,
  Lock,
  LockOpen
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';

const { ROLE_MEMBER, ROLE_OWNER } = ACCOUNT_ROLES;
const {
  U_APPROVE,
  U_BAN,
  U_CANCEL_INVITATION,
  U_COPY_INVITATION_LINK,
  U_REJECT,
  U_RESEND,
  U_UNBAN
} = APP_ACTIONS;

const { U_ACTIVE, U_BANNED, U_PENDING } = STATUS;

const connectToRedux = connect(
  createStructuredSelector({
    partnerMembersData: getQuickFilterPartnerMembersSelector,
    sendInviteError: sendInviteToMemberErrorSelector
  }),
  dispatch => ({
    sendInvite: payload => {
      dispatch(sendInviteToMember(payload));
    },
    getMemberList: (
      page = 0,
      pageSize = 10,
      searchText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterMemberList({
            page,
            pageSize,
            filterContents: searchText.trim(),
            dateRange
          })
        );
    },

    approveMember: id => dispatch(approveMember(id)),
    rejectMember: id => dispatch(rejectMember(id)),
    banMember: id => dispatch(banMember(id)),
    unbanMember: id => dispatch(unbanMember(id)),
    cancelInvitation: id => dispatch(cancelMemberInvitation(id))
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

class PartnerMemberManagementComponent extends React.Component {
  render() {
    const {
      partnerMembersData,
      sendInvite,
      approveMember,
      rejectMember,
      banMember,
      unbanMember,
      cancelInvitation,
      setSearchMessage,
      getMemberList,
      searchMessage,
      dateRange,
      setDateRange,
      t,
      sendInviteError
    } = this.props;
    const getMemberManagementActions = (
      partnerMember,
      { banMember, unbanMember, cancelInvitation }
    ) => {
      switch (partnerMember.status) {
        case U_PENDING: {
          if (partnerMember.role === ROLE_OWNER) {
            return [];
          }

          if (partnerMember.fullName === partnerMember.email) {
            return [
              {
                label: getLabelByActionWithT({ action: U_RESEND, t }),
                action: () => {},
                icon: <Replay />
              },
              {
                label: getLabelByActionWithT({
                  action: U_COPY_INVITATION_LINK,
                  t
                }),
                action: () => {
                  const partnerServerUrl =
                    process.env.DOMAIN_NAME || 'http://localhost:3006';

                  const url = `${partnerServerUrl}/member-register?${objToQueryString(
                    {
                      email: partnerMember.email,
                      partnerId: partnerMember.partner.id,
                      id: partnerMember.id
                    }
                  )}`;

                  copyToClipboard(url);
                },
                icon: <FileCopy />
              },
              {
                label: getLabelByActionWithT({
                  action: U_CANCEL_INVITATION,
                  t
                }),
                action: () => {
                  cancelInvitation(partnerMember.id);
                },
                icon: <Cancel />
              }
            ];
          } else {
            return [
              {
                label: getLabelByActionWithT({ action: U_APPROVE, t }),
                action: () => {
                  approveMember(partnerMember.id);
                },
                icon: <AssignmentTurnedIn />
              },
              {
                label: getLabelByActionWithT({ action: U_REJECT, t }),
                action: () => {
                  rejectMember(partnerMember.id);
                },
                icon: <Cancel />
              }
            ];
          }
        }
        case U_ACTIVE: {
          if (partnerMember.role === ROLE_MEMBER) {
            return [
              {
                label: getLabelByActionWithT({ action: U_BAN, t }),
                action: () => {
                  banMember(partnerMember.id);
                },
                icon: <Lock />
              }
            ];
          }
          return [];
        }
        case U_BANNED: {
          return [
            {
              label: getLabelByActionWithT({ action: U_UNBAN, t }),
              action: () => {
                unbanMember(partnerMember.id);
              },
              icon: <LockOpen />
            }
          ];
        }
        default:
          return [];
      }
    };

    const mapPartnerMembersListToDataField = ({
      partnerMembers = [],
      approveMember,
      rejectMember,
      banMember,
      unbanMember,
      cancelInvitation
    }) =>
      partnerMembers.map(partnerMember => {
        return {
          email: partnerMember.email,
          memberName: (
            <Grid container alignItems="center" direction="row">
              {partnerMember.status !== U_ACTIVE ? (
                <span>{partnerMember.fullName}</span>
              ) : (
                <Fragment>
                  <AvatarComponent small />
                  <span>&nbsp;&nbsp;</span>
                  <Link
                    href={createLink([
                      'member',
                      `details?id=${partnerMember.id}`
                    ])}
                  >
                    <a>{partnerMember.fullName}</a>
                  </Link>
                </Fragment>
              )}
            </Grid>
          ),
          role: partnerMember.role,
          joinDate: (
            <Moment format={DATE_TIME_FORMAT}>{partnerMember.createdAt}</Moment>
          ),
          status: <UserStatusComponent t={t} status={partnerMember.status} />,
          action:
            partnerMember.role !== ROLE_OWNER
              ? getMemberManagementActions(partnerMember, {
                  banMember,
                  unbanMember,
                  cancelInvitation,
                  approveMember,
                  rejectMember
                }).map(({ label, action, icon }, index) => (
                  <ButtonActionTableComponent
                    key={index}
                    label={label}
                    action={action}
                    icon={icon}
                  />
                ))
              : null
        };
      });
    const COLUMNS = [
      {
        field: 'memberName',
        title: t('table.member.manage.header.member_name')
      },
      {
        field: 'email',
        title: t('table.member.manage.header.email')
      },
      {
        field: 'role',
        title: t('table.member.manage.header.role')
      },
      {
        field: 'joinDate',
        title: t('table.member.manage.header.join_date')
      },
      {
        field: 'status',
        title: t('table.member.manage.header.status')
      },
      {
        field: 'action',
        title: t('table.member.manage.header.action')
      }
    ];
    let partnerMembers = [],
      totalCount = 0,
      page = 0,
      pageSize = 10;
    if (partnerMembersData) {
      partnerMembers = partnerMembersData.partnerUsers;
      totalCount = partnerMembersData.pageInfos.totalCount;
      page = partnerMembersData.pageInfos.filter.page;
      pageSize = partnerMembersData.pageInfos.filter.pageSize;
    }
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={sendInviteError} />
        <FrameHeaderComponent title={t('table.member.manage.title')}>
          <InviteComponent onClick={sendInvite} />
        </FrameHeaderComponent>
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.member.manage.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapPartnerMembersListToDataField({
            partnerMembers,
            approveMember,
            rejectMember,
            banMember,
            unbanMember,
            cancelInvitation
          })}
          columns={COLUMNS}
          dispatchAction={getMemberList}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          t={t}
        />
      </React.Fragment>
    );
  }
}

export default enhance(AuthenHOC(PartnerMemberManagementComponent));
