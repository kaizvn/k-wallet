import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { APP_ACTIONS, STATUS, ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import {
  DATE_TIME_FORMAT,
  getLabelByActionWithT,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import {
  DisplayCoinLogoComponent,
  DisplayErrorMessagesComponent,
  FrameHeaderComponent,
  TransactionStatusComponent,
  DisplayAmountTransactionComponent,
  ButtonActionTableComponent
} from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';

import { currentUserSelector } from '../stores/UserState';
import {
  getQuickFilterPendingTransactions,
  getQuickFilterPendingTransactionsSelector,
  getQuickFilterPendingTransactionsErrorSelector
} from '../stores/PartnerState';

import {
  approvePendingTransaction,
  rejectPendingTransaction
} from '@revtech/rev-shared/apis/actions';
import { AssignmentTurnedIn, Cancel } from '@material-ui/icons';
import { Grid, Typography } from '@material-ui/core';

const { P_APPROVE, P_REJECT } = APP_ACTIONS;
const { TRANSACTION_PENDING_PARTNER_APPROVAL } = STATUS;
const { ROLE_MEMBER } = ACCOUNT_ROLES;

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    errorMessages: getQuickFilterPendingTransactionsErrorSelector,
    transactionsData: getQuickFilterPendingTransactionsSelector
  }),
  dispatch => ({
    approvePendingTx: (id, callback) =>
      dispatch(approvePendingTransaction(id, callback)),
    rejectPendingTx: (id, callback) =>
      dispatch(rejectPendingTransaction(id, callback)),
    getTransactionsList: (
      page,
      pageSize,
      searchMessage = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterPendingTransactions({
            page,
            pageSize,
            searchMessage,
            dateRange
          })
        );
    }
  })
);

const TransactionsOwnerDataComponent = ({ transItemOwner }) => (
  <span>
    {transItemOwner.name || transItemOwner.fullName || transItemOwner.address}
  </span>
);

const getPartnerManagementActions = (
  transaction,
  { approvePendingTx, rejectPendingTx, t }
) => [
  {
    label: getLabelByActionWithT({ action: P_APPROVE, t }),
    action: () =>
      approvePendingTx(transaction.id, dispatch =>
        dispatch(getQuickFilterPendingTransactions({}))
      ),
    icon: <AssignmentTurnedIn />
  },
  {
    label: getLabelByActionWithT({ action: P_REJECT, t }),
    action: () =>
      rejectPendingTx(transaction.id, dispatch =>
        dispatch(getQuickFilterPendingTransactions({}))
      ),
    icon: <Cancel />
  }
];

const mapTransactionToDataField = ({
  transactions = [],
  approvePendingTx,
  rejectPendingTx,
  t
}) =>
  transactions.map(transItem => ({
    paymentDate: (
      <Moment format={DATE_TIME_FORMAT}>{new Date(transItem.createdAt)}</Moment>
    ),
    status: <TransactionStatusComponent status={transItem.status} t={t} />,
    currency: (
      <Grid container alignItems="center" direction="row">
        <DisplayCoinLogoComponent coin={transItem.coin} small />
        <span>&nbsp;&nbsp;</span>
        <Typography style={{ fontWeight: 'bold' }} variant="button">
          {transItem.coin.symbol}
        </Typography>
      </Grid>
    ),
    amount: (
      <DisplayAmountTransactionComponent
        type={transItem.type}
        amount={transItem.amount}
      />
    ),
    from: <TransactionsOwnerDataComponent transItemOwner={transItem.from} />,
    to: <TransactionsOwnerDataComponent transItemOwner={transItem.to} />,
    actions:
      transItem.status === TRANSACTION_PENDING_PARTNER_APPROVAL
        ? getPartnerManagementActions(transItem, {
            approvePendingTx,
            rejectPendingTx,
            t
          }).map(({ label, action, icon }, index) => (
            <ButtonActionTableComponent
              key={index}
              label={label}
              action={action}
              icon={icon}
            />
          ))
        : null
  }));
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

class PendingTransactionsComponent extends React.Component {
  render() {
    const {
      transactionsData,
      getTransactionsList,
      searchMessage,
      setSearchMessage,
      currentUser,
      errorMessages,
      approvePendingTx,
      rejectPendingTx,
      dateRange,
      setDateRange,
      t
    } = this.props;
    const COLUMNS = [
      {
        field: 'paymentDate',
        title: t('table.transaction.transactions.header.payment_date')
      },
      {
        field: 'status',
        title: t('table.transaction.transactions.header.status')
      },
      {
        field: 'currency',
        title: t('table.transaction.transactions.header.currency')
      },
      {
        field: 'amount',
        title: t('table.transaction.transactions.header.amount')
      },
      {
        field: 'from',
        title: t('table.transaction.transactions.header.from')
      },
      {
        field: 'to',
        title: t('table.transaction.transactions.header.to')
      }
    ];
    if (currentUser && currentUser.partnerUserRole !== ROLE_MEMBER) {
      COLUMNS.push({
        field: 'actions',
        title: t('table.transaction.transactions.header.actions')
      });
    }
    let transactions = [],
      totalCount = 0,
      page = 0,
      pageSize = 10;
    if (transactionsData) {
      transactions = transactionsData.transactions;
      totalCount = transactionsData.pageInfos.totalCount;
      page = transactionsData.pageInfos.filter.page;
      pageSize = transactionsData.pageInfos.filter.pageSize;
    }
    return (
      <React.Fragment>
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <FrameHeaderComponent
          title={t('table.transaction.payment.title')}
        ></FrameHeaderComponent>
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.transaction.transactions.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapTransactionToDataField({
            transactions,
            approvePendingTx,
            rejectPendingTx,
            t
          })}
          columns={COLUMNS}
          dispatchAction={getTransactionsList}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          t={t}
        />
      </React.Fragment>
    );
  }
}
export default enhance(PendingTransactionsComponent);
