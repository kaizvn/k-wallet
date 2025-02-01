import React from 'react';

import TransactionCardComponent from './TransactionCardComponent';
import { EmptyDataComponent } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
const DisplayTransactionsComponent = ({ transactions = [], userId, t }) => (
  <div className="row">
    {!transactions.length ? (
      <EmptyDataComponent message={t('message.empty_transaction')} />
    ) : (
      transactions.map(transaction => (
        <TransactionCardComponent
          key={transaction.id}
          transaction={transaction}
          userId={userId}
        />
      ))
    )}
  </div>
);

export default withTranslation('common')(DisplayTransactionsComponent);
