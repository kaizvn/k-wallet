import {
  ReactTableLayout,
  AlertDialog,
  InputText
} from '@revtech/rev-shared/layouts';
import { APP_ACTIONS, STATUS } from '@revtech/rev-shared/enums';
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
  ButtonActionTableComponent,
  DisplayAmountTransactionComponent
} from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React, { useState, useEffect } from 'react';

import {
  getQuickFilterPendingTransactions,
  getQuickFilterPendingTransactionsSelector,
  getQuickFilterPendingTransactionsErrorSelector
} from '../stores/PartnerState';

import {
  approvePendingTransaction,
  rejectPendingTransaction,
  manualTransaction
} from '@revtech/rev-shared/apis/actions';
import { manualTransactionDataSelector } from '@revtech/rev-shared/apis/selectors';
import { manualTransactionResetter } from '@revtech/rev-shared/apis/resetters';
import { Grid, Typography } from '@material-ui/core';
import { AssignmentTurnedIn, Cancel, BorderColor } from '@material-ui/icons';

const { TX_APPROVE, TX_REJECT, TX_MANUAL } = APP_ACTIONS;
const { TRANSACTION_MANUAL_ADMIN } = STATUS;

const connectToRedux = connect(
  createStructuredSelector({
    transactionsData: getQuickFilterPendingTransactionsSelector,
    errorMessages: getQuickFilterPendingTransactionsErrorSelector,
    manualTxData: manualTransactionDataSelector
  }),
  dispatch => ({
    approvePendingTx: (id, callback) =>
      dispatch(approvePendingTransaction(id, callback)),
    rejectPendingTx: (id, callback) =>
      dispatch(rejectPendingTransaction(id, callback)),
    manualTx: (hash, txId) =>
      dispatch(
        manualTransaction(hash, txId, dispatch =>
          dispatch(getQuickFilterPendingTransactions({}))
        )
      ),
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
    },
    resetManualTx: () => dispatch(manualTransactionResetter)
  })
);

const TransactionsOwnerDataComponent = ({ transItemOwner }) => (
  <span>
    {transItemOwner.name || transItemOwner.fullName || transItemOwner.address}
  </span>
);

const getAdminManagementActions = (
  transaction,
  { approvePendingTx, rejectPendingTx, t, setIsOpenManual, setCurrentTxId }
) => {
  let actions = [
    {
      label: getLabelByActionWithT({ action: TX_APPROVE, t }),
      action: () =>
        approvePendingTx(transaction.id, dispatch =>
          dispatch(getQuickFilterPendingTransactions({}))
        ),
      icon: <AssignmentTurnedIn />
    },
    {
      label: getLabelByActionWithT({ action: TX_REJECT, t }),
      action: () =>
        rejectPendingTx(transaction.id, dispatch =>
          dispatch(getQuickFilterPendingTransactions({}))
        ),
      icon: <Cancel />
    }
  ];
  if (transaction.status === TRANSACTION_MANUAL_ADMIN) {
    actions.push({
      label: getLabelByActionWithT({ action: TX_MANUAL, t }),
      action: () => {
        setIsOpenManual(true);
        setCurrentTxId(transaction.id);
      },
      icon: <BorderColor />
    });
  }
  return actions;
};

const mapTransactionToDataField = ({
  transactions = [],
  approvePendingTx,
  rejectPendingTx,
  t,
  setIsOpenManual,
  setCurrentTxId
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
    actions: getAdminManagementActions(transItem, {
      approvePendingTx,
      rejectPendingTx,
      t,
      setIsOpenManual,
      setCurrentTxId
    }).map(({ label, action, icon }, index) => (
      <ButtonActionTableComponent
        key={index}
        label={label}
        action={action}
        icon={icon}
      />
    ))
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

const PendingTransactionsComponent = ({
  transactionsData,
  t,
  searchMessage,
  setSearchMessage,
  errorMessages,
  getTransactionsList,
  approvePendingTx,
  rejectPendingTx,
  dateRange,
  setDateRange,
  manualTx,
  manualTxData,
  resetManualTx
}) => {
  const [isOpenManual, setIsOpenManual] = useState(false);
  const [currentTxId, setCurrentTxId] = useState(null);
  const [hash, setHash] = useState('');

  useEffect(() => {
    if (manualTxData) {
      setIsOpenManual(false);
      setHash('');
      resetManualTx();
    }
  }, [manualTxData, resetManualTx]);

  const COLUMNS = [
    {
      field: 'paymentDate',
      title: t('table.transactions_manage.header.payment_date')
    },
    {
      field: 'status',
      title: t('table.transactions_manage.header.status')
    },
    {
      field: 'currency',
      title: t('table.transactions_manage.header.currency')
    },
    {
      field: 'amount',
      title: t('table.transactions_manage.header.amount')
    },
    {
      field: 'from',
      title: t('table.transactions_manage.header.from')
    },
    {
      field: 'to',
      title: t('table.transactions_manage.header.to')
    },
    {
      field: 'actions',
      title: t('table.transactions_manage.header.actions')
    }
  ];

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
      <AlertDialog
        title={t('table.transactions_manage.manual.title')}
        onClose={() => setIsOpenManual(false)}
        fullWidth
        size="sm"
        isOpenDialog={isOpenManual}
        setIsOpenDialog={setIsOpenManual}
        okText={t('table.transactions_manage.manual.submit')}
        onOk={() => {
          hash && manualTx(hash, currentTxId);
        }}
        content={
          <Grid
            style={{ paddingBottom: 24 }}
            container
            justify="center"
            alignItems="center"
          >
            <InputText
              value={hash}
              label={t('table.transactions_manage.manual.label')}
              placeholder={t('table.transactions_manage.manual.label')}
              size="small"
              onChange={value => setHash(value)}
            />
          </Grid>
        }
      />
      <DisplayErrorMessagesComponent messages={errorMessages} />
      <FrameHeaderComponent title={t('table.payments_manage.title')} />
      <ReactTableLayout
        searchProps={{
          placeholder: t('table.transactions_manage.placeholder_search'),
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
          t,
          setIsOpenManual,
          setCurrentTxId
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
};
export default enhance(PendingTransactionsComponent);
