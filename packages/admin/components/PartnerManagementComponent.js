import { APP_ACTIONS, STATUS } from '@revtech/rev-shared/enums';
import {
  AvatarComponent,
  FrameHeaderComponent,
  InviteComponent,
  DisplayErrorMessagesComponent,
  PartnerStatusComponent,
  ButtonActionTableComponent
} from '@revtech/rev-shared/components';
import {
  DATE_TIME_FORMAT,
  InformationComponent,
  getLabelByActionWithT,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
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
import React from 'react';

import {
  sendInviteToPartner,
  approvePartner,
  rejectPartner,
  banPartner,
  unbanPartner,
  cancelPartnerInvitation,
  getQuickFilterPartnerListSelector,
  getQuickFilterPartnerList,
  sendInvitePartnerErrorSelector
} from '../stores/AdminState';
import {
  Replay,
  FileCopy,
  Cancel,
  AssignmentTurnedIn,
  Lock,
  LockOpen
} from '@material-ui/icons';
import { Grid } from '@material-ui/core';

const {
  P_APPROVE,
  P_BAN,
  P_CANCEL_INVITATION,
  P_COPY_INVITATION_LINK,
  P_REJECT,
  P_RESEND,
  P_UNBAN,
  P_CANCELLED
} = APP_ACTIONS;
const { P_ACTIVE, P_PENDING, P_SUSPENDED, P_BANNED } = STATUS;
const connectToRedux = connect(
  createStructuredSelector({
    partnersData: getQuickFilterPartnerListSelector,
    sendInviteError: sendInvitePartnerErrorSelector
  }),
  dispatch => ({
    getPartnerList: (
      page,
      pageSize,
      filterContents = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterPartnerList({
            page,
            pageSize,
            filterContents,
            dateRange
          })
        );
    },
    sendInvite: payload => dispatch(sendInviteToPartner(payload)),
    approve: id => dispatch(approvePartner(id)),
    reject: id => dispatch(rejectPartner(id)),
    ban: id => dispatch(banPartner(id)),
    unban: id => dispatch(unbanPartner(id)),
    cancelInvitation: id => dispatch(cancelPartnerInvitation(id))
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

const getPartnerManagementActions = (
  partners,
  {
    approvePartner,
    rejectPartner,
    banPartner,
    unbanPartner,
    cancelPartnerInvitation,
    t
  }
) => {
  const { status, owner = {}, id } = partners || {};
  if (status === P_PENDING) {
    if (owner.fullName === owner.email) {
      return [
        {
          label: getLabelByActionWithT({ action: P_RESEND, t }),
          action: () => {},
          icon: <Replay />
        },
        {
          label: getLabelByActionWithT({ action: P_COPY_INVITATION_LINK, t }),
          action: () => {
            const partnerServerUrl =
              process.env.PARTNER_SERVER_URL || 'http://localhost:3006';

            const url = `${partnerServerUrl}/register?${objToQueryString({
              email: owner.email,
              id: owner.id
            })}`;

            copyToClipboard(url);
          },
          icon: <FileCopy />
        },
        {
          label: getLabelByActionWithT({ action: P_CANCEL_INVITATION, t }),
          action: () => {
            cancelPartnerInvitation(id);
          },
          icon: <Cancel />
        }
      ];
    } else {
      return [
        {
          label: getLabelByActionWithT({ action: P_APPROVE, t }),
          action: () => {
            approvePartner(id);
          },
          icon: <AssignmentTurnedIn />
        },
        {
          label: getLabelByActionWithT({ action: P_REJECT, t }),
          action: () => {
            rejectPartner(id);
          },
          icon: <Cancel />
        }
      ];
    }
  }
  if (status === P_ACTIVE) {
    return [
      {
        label: getLabelByActionWithT({ action: P_BAN, t }),
        action: () => {
          banPartner(id);
        },
        icon: <Lock />
      }
    ];
  }
  if (status === P_SUSPENDED || status === P_BANNED) {
    return [
      {
        label: getLabelByActionWithT({ action: P_UNBAN, t }),
        action: () => {
          unbanPartner(id);
        },
        icon: <LockOpen />
      }
    ];
  }
  if (status === P_CANCELLED) {
    return [
      {
        label: getLabelByActionWithT({ action: P_RESEND, t }),
        action: () => {},
        icon: <Replay />
      }
    ];
  }
};

const mapPartnerToDataField = ({
  partners = [],
  approvePartner,
  rejectPartner,
  banPartner,
  unbanPartner,
  cancelPartnerInvitation,
  t
}) =>
  partners.map(partnerItem => ({
    name: (
      <Link href={createLink(['partner', `details?id=${partnerItem.id}`])}>
        <a>
          <InformationComponent>{partnerItem.name}</InformationComponent>
        </a>
      </Link>
    ),
    createdAt: (
      <Moment format={DATE_TIME_FORMAT}>{partnerItem.createdAt}</Moment>
    ),
    fullName: (
      <Grid container alignItems="center" direction="row">
        <AvatarComponent small url={partnerItem.avatar} />
        <span>&nbsp;&nbsp;</span>
        {partnerItem.owner.fullName === partnerItem.owner.email ? (
          <a>
            <InformationComponent>
              {partnerItem.owner.fullName}
            </InformationComponent>
          </a>
        ) : (
          <Link
            href={createLink([
              'partner',
              'users',
              `details?id=${partnerItem.owner.id}`
            ])}
          >
            <a>
              <InformationComponent>
                {partnerItem.owner.fullName}
              </InformationComponent>
            </a>
          </Link>
        )}
      </Grid>
    ),
    email: partnerItem.email,
    status: <PartnerStatusComponent t={t} status={partnerItem.status} />,
    actions: (
      getPartnerManagementActions(partnerItem, {
        approvePartner,
        rejectPartner,
        banPartner,
        unbanPartner,
        cancelPartnerInvitation,
        t
      }) || []
    ).map(({ label, action, icon }, index) => (
      <ButtonActionTableComponent
        key={index}
        label={label}
        action={action}
        icon={icon}
      />
    ))
  }));

class PartnerManagementComponent extends React.Component {
  render() {
    const {
      partnersData,
      sendInvite,
      approve,
      reject,
      ban,
      unban,
      cancelInvitation,
      getPartnerList,
      t,
      sendInviteError,
      searchMessage,
      setSearchMessage,
      dateRange,
      setDateRange
    } = this.props;
    let partners = [],
      totalCount = 0,
      page = 0,
      pageSize = 10;
    if (partnersData) {
      partners = partnersData.partners;
      totalCount = partnersData.pageInfos.totalCount;
      page = partnersData.pageInfos.filter.page;
      pageSize = partnersData.pageInfos.filter.pageSize;
    }
    const COLUMNS = [
      {
        field: 'name',
        title: t('table.partner_manage.header.partner')
      },
      {
        field: 'createdAt',
        title: t('table.partner_manage.header.join_date')
      },
      {
        field: 'fullName',
        title: t('table.partner_manage.header.owner')
      },
      {
        field: 'email',
        title: t('table.partner_manage.header.email')
      },
      {
        field: 'status',
        title: t('table.partner_manage.header.status')
      },
      {
        field: 'actions',
        title: ''
      }
    ];
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={sendInviteError} />
        <FrameHeaderComponent title={t('table.partner_manage.title')}>
          <InviteComponent onClick={sendInvite} />
        </FrameHeaderComponent>
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.partner_manage.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapPartnerToDataField({
            partners: partners,
            approvePartner: approve,
            rejectPartner: reject,
            banPartner: ban,
            unbanPartner: unban,
            cancelPartnerInvitation: cancelInvitation,
            t
          })}
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

export default enhance(PartnerManagementComponent);
