import {
  DATE_TIME_FORMAT,
  getLabelByActionWithT
} from '@revtech/rev-shared/utils';
import {
  DropdownComponent,
  FrameComponent,
  FrameHeaderComponent,
  TransactionStatusComponent,
  DisplayCoinLogoComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Moment from 'react-moment';
import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';

import {
  getPendingTransactionsSelector,
  getPendingTransactionsErrorSelector,
  getPendingTransactions,
  approvePendingTransaction,
  getApprovePendingTransactionErrorSelector,
  resetApprovePendingTransaction
} from '../stores/PartnerState';
import { APP_ACTIONS } from '@revtech/rev-shared/enums';
const {
  TRANSACTION_APPROVE_BY_ADMIN,
  TRANSACTION_REJECT_BY_ADMIN
} = APP_ACTIONS;
const TransactionsOwnerDataComponent = ({ transItemOwner }) => (
  <span>
    {transItemOwner.name || transItemOwner.fullName || transItemOwner.address}
  </span>
);

const mapTransactionToDataField = ({
  transactions = [],
  t,
  approvePendingTransaction
}) =>
  transactions.map(transItem => ({
    paymentDate: (
      <Moment format={DATE_TIME_FORMAT}>{new Date(transItem.createdAt)}</Moment>
    ),
    status: <TransactionStatusComponent t={t} status={transItem.status} />,
    currency: (
      <div className="d-flex justify-content-center align-items-center">
        <DisplayCoinLogoComponent coin={transItem.coin} small />
        <span className="ml-2 font-weight-bold">{transItem.coin.symbol}</span>
      </div>
    ),
    hashUrl: transItem.hash && (
      <a href={transItem.hashUrl} target="_blank" rel="noopener noreferrer">
        {transItem.hash}
      </a>
    ),
    amount: <span className="font-weight-bold">{transItem.amount}</span>,
    from: <TransactionsOwnerDataComponent transItemOwner={transItem.from} />,
    to: <TransactionsOwnerDataComponent transItemOwner={transItem.to} />,
    action: (
      <DropdownComponent
        items={[
          {
            label: getLabelByActionWithT({
              action: TRANSACTION_APPROVE_BY_ADMIN,
              t
            }),
            action: () => {
              approvePendingTransaction(transItem.id);
            } //approveTransaction()
          },
          {
            label: getLabelByActionWithT({
              action: TRANSACTION_REJECT_BY_ADMIN,
              t
            }),
            action: () => {} //rejectTransaction()
          }
        ]}
      />
    )
  }));

const connectToRedux = connect(
  createStructuredSelector({
    transactions: getPendingTransactionsSelector,
    approveErrorMessages: getApprovePendingTransactionErrorSelector,
    getPendingTransactionsErrorMessages: getPendingTransactionsErrorSelector
  }),
  dispatch => ({
    getTransactionsList: () => {
      dispatch(getPendingTransactions());
    },
    approvePendingTransaction: id => {
      dispatch(approvePendingTransaction(id));
    },
    resetData: () => {
      resetApprovePendingTransaction(dispatch);
    }
  })
);
const withSearchMessageState = withState(
  'searchMessage',
  'setSearchMessage',
  ''
);
const enhance = compose(
  withSearchMessageState,
  withTranslation('react-table'),
  connectToRedux
);
class TransactionsReviewComponent extends React.Component {
  componentWillUnmount() {
    this.props.resetData();
  }
  render() {
    const {
      transactions,
      t,
      approvePendingTransaction,
      approveErrorMessages,
      getPendingTransactionsErrorMessages
    } = this.props;

    const COLUMNS = [
      {
        accessor: 'paymentDate',
        Header: t('table.transactions_pending_manage.header.payment_date')
      },
      {
        accessor: 'status',
        Header: t('table.transactions_pending_manage.header.status')
      },
      {
        accessor: 'currency',
        Header: t('table.transactions_pending_manage.header.currency')
      },
      {
        accessor: 'hashUrl',
        Header: t('table.transactions_pending_manage.header.hash')
      },
      {
        accessor: 'amount',
        Header: t('table.transactions_pending_manage.header.amount')
      },
      {
        accessor: 'from',
        Header: t('table.transactions_pending_manage.header.from')
      },
      {
        accessor: 'to',
        Header: t('table.transactions_pending_manage.header.to')
      },
      { accessor: 'action', Header: '', className: 'overflow-dropbox' }
    ];

    return (
      <React.Fragment>
        {(approveErrorMessages || getPendingTransactionsErrorMessages) && (
          <div className="row d-flex justify-content-center mt-4">
            <DisplayErrorMessagesComponent
              messages={[
                ...approveErrorMessages,
                ...getPendingTransactionsErrorMessages
              ]}
            />
          </div>
        )}
        <FrameComponent>
          <FrameHeaderComponent
            title={t('table.transactions_pending_manage.title')}
          />
          <div className="card-block ks-datatable table-responsive">
            <ReactTableLayout
              data={mapTransactionToDataField({
                t,
                transactions,
                approvePendingTransaction
              })}
              columns={COLUMNS}
              dispatchAction={this.props.getTransactionsList}
              {...this.props}
            />
          </div>
        </FrameComponent>
      </React.Fragment>
    );
  }
}
export default enhance(TransactionsReviewComponent);
