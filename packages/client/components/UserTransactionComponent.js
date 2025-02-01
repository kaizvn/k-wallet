import { InformationComponent } from '@revtech/rev-shared/utils';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';

const InfoBlockComponent = ({ label, info }) =>
  info ? (
    <div className="d-flex justify-content-between mb-1">
      <span className="text-left font-weight-bold">{label}</span>
      <span className="text-right text-block">{info}</span>
      <style jsx>
        {`
          .text-block {
            width: 80%;
            display: block;
          }
        `}
      </style>
    </div>
  ) : null;

const TransactionsOwnerDataComponent = ({ transItemOwner }) =>
  transItemOwner && (
    <span>
      {transItemOwner.name || transItemOwner.fullName || transItemOwner.address}
    </span>
  );

const UserTransactionComponent = ({ transItem, userId, t }) => {
  const isPaidTx = transItem.from && userId === transItem.from.id;
  const getTxInfo = txItem => {
    if (!txItem) {
      return null;
    }
    return {
      id: txItem.id,
      currency: (
        <InformationComponent>{txItem.coin.symbol}</InformationComponent>
      ),
      from: <TransactionsOwnerDataComponent transItemOwner={txItem.from} />,
      to: <TransactionsOwnerDataComponent transItemOwner={txItem.to} />,
      hash: txItem.hash,
      type: isPaidTx ? 'paid' : 'received',
      hashUrl: txItem.hashUrl
    };
  };
  const txInfo = getTxInfo(transItem);
  return (
    <div className="card-block">
      {txInfo.type === 'received' && (
        <InfoBlockComponent
          label={t('recent_transactions.card.label.from') + ':'}
          info={txInfo.from}
        />
      )}
      {txInfo.type === 'paid' && (
        <InfoBlockComponent
          label={t('recent_transactions.card.label.to') + ':'}
          info={txInfo.to}
        />
      )}

      <InfoBlockComponent
        label={t('recent_transactions.card.label.hash') + ':'}
        info={
          <a href={transItem.hashUrl} target="_blank" rel="noopener noreferrer">
            <span className="font-italic">{txInfo.hash}</span>
          </a>
        }
      />
    </div>
  );
};

export default withTranslation('dashboard')(UserTransactionComponent);
