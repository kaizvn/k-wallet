import { Button, RLink, ReactTableLayout } from '@revtech/rev-shared/layouts';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import {
  DisplayCoinLogoComponent,
  DisplayErrorMessagesComponent,
  FrameHeaderComponent,
  TransactionStatusComponent,
  DisplayHashUrlComponent,
  DisplayAmountTransactionComponent
} from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getParentPath } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  getQuickFilterTransactionsListSelector,
  getQuickFilterTransactionsErrorSelector,
  getQuickFilterTransactionsList
} from '../stores/PartnerState';
import { Grid, Typography } from '@material-ui/core';

const connectToRedux = connect(
  createStructuredSelector({
    transactionsData: getQuickFilterTransactionsListSelector,
    errorMessages: getQuickFilterTransactionsErrorSelector
  }),
  dispatch => ({
    getTransactionsList: (
      page,
      pageSize,
      searchMessage = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterTransactionsList({
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

const mapTransactionToDataField = ({ transactions = [], t }) =>
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
    hashUrl: transItem.hash && (
      <DisplayHashUrlComponent
        hash={transItem.hash}
        hashUrl={transItem.hashUrl}
      />
    ),
    amount: (
      <DisplayAmountTransactionComponent
        type={transItem.type}
        amount={transItem.amount}
      />
    ),
    from: <TransactionsOwnerDataComponent transItemOwner={transItem.from} />,
    to: <TransactionsOwnerDataComponent transItemOwner={transItem.to} />
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
  withTranslation(['react-table', 'common'])
);

class TransactionsComponent extends React.Component {
  render() {
    const {
      transactionsData,
      t,
      searchMessage,
      setSearchMessage,
      errorMessages,
      getTransactionsList,
      dateRange,
      setDateRange
    } = this.props;

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
        field: 'hashUrl',
        title: t('table.transactions_manage.header.hash')
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
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <FrameHeaderComponent title={t('table.transactions_manage.title')}>
          <RLink href={getParentPath(Router.router.pathname) + '/transfer'}>
            <Button>{t('table.transactions_manage.transfer')}</Button>
          </RLink>
        </FrameHeaderComponent>
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
          data={mapTransactionToDataField({ transactions, t })}
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
export default enhance(TransactionsComponent);
