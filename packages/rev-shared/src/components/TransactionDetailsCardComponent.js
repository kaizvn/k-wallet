import Moment from 'react-moment';
import React from 'react';

import { DATE_TIME_FORMAT } from '../utils';
import { copyToClipboard } from '../libs';
import { withTranslation } from '../i18n';
import AvatarComponent from './AvatarComponent';
import EmptyDataComponent from './EmptyDataComponent';
import TransactionStatusComponent from './TransactionStatusComponent';
import TransactionTypesComponent from './TransactionTypesComponent';

const RowTransactionComponent = ({ title, children }) => (
  <div className="row align-items-center">
    <div className="col-md-3 mb-1 mb-md-0">{title}:</div>
    <div className="col-md-9">{children}</div>
  </div>
);

const ReceiverWithdrawComponent = ({ transItem }) => {
  const transItemTo = transItem.to;
  return (
    <span>
      {transItem.receivedAddress ||
        transItemTo.name ||
        transItemTo.fullName ||
        transItemTo.address}
    </span>
  );
};

const TransactionDetailsCardComponent = ({ transaction, t }) => (
  <div>
    {transaction ? (
      <div className="card shadow border-0 p-3 rounded-0 mt-3">
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.transaction_id')}
        >
          <span className="font-weight-bold">
            {transaction.id}
            <a
              className="ml-1 copy"
              onClick={() => {
                copyToClipboard(transaction.id);
              }}
            >
              <i className="ml-1 icon icon-copy" />
            </a>
          </span>
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.currency')}
        >
          <AvatarComponent small url={transaction.coin.logo} />{' '}
          {transaction.coin.symbol}
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.transaction_type')}
        >
          <TransactionTypesComponent type={transaction.type} t={t} />
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.receiver')}
        >
          <ReceiverWithdrawComponent transItem={transaction} />
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.amount')}
        >
          {transaction.amount} {transaction.coin && transaction.coin.symbol}
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.fee')}
        >
          {transaction.fee}
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.status')}
        >
          <TransactionStatusComponent status={transaction.status} t={t} />
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.date_created')}
        >
          <i className="mr-1 icon icon-time" />
          <Moment format={DATE_TIME_FORMAT}>
            {new Date(transaction.createdAt)}
          </Moment>
        </RowTransactionComponent>
        <hr className="hr-space" />
        <RowTransactionComponent
          title={t('rev_shared.transaction_card.label.description')}
        >
          {transaction.description ? (
            transaction.description
          ) : (
            <span className="badge badge-default">No Description</span>
          )}
        </RowTransactionComponent>
        <hr className="hr-space" />
      </div>
    ) : (
      <EmptyDataComponent message={t('rev_shared.message.empty_transaction')} />
    )}
    <style jsx>{`
                .empty-transaction {
                    display: flex;
                    flex: auto;
                    justify-content: center;
                }
                .shadow {
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1),
                    0 6px 6px rgba(0, 0, 0, 0.1);
                }
                .hr-space {
                    margin-top: 0.65rem;
                    margin-bottom: 0.65rem;
                    opacity: 0.75;
                  }
                  .icon-time:before {
                    content: '\f236';
                  }
                  .icon-copy:before {
                    content: '\f190';
                  }
                  .copy {
                    cursor: pointer;
                  }
                  .icon {
                    font: normal normal normal 16px/1 LineAwesome;
                    font-size: inherit;
                    text-decoration: inherit;
                    text-rendering: optimizeLegibility;
                    text-transform: none;
                    font-smoothing: antialiased;
                    display: inline-block;
                  }
                }
                `}</style>
  </div>
);

export default withTranslation('common')(TransactionDetailsCardComponent);
