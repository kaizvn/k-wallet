import React from 'react';

import PaymentCardComponent from './PaymentCardComponent';
import { EmptyDataComponent } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';

const DisplayPaymentsComponent = ({ transactions = [], userId, t }) => (
  <div className="row">
    {!transactions.length ? (
      <EmptyDataComponent message={t('message.empty_payment')} />
    ) : (
      transactions.map(transaction => (
        <PaymentCardComponent
          key={transaction.id}
          transaction={transaction}
          userId={userId}
        />
      ))
    )}
  </div>
);

export default withTranslation('common')(DisplayPaymentsComponent);
