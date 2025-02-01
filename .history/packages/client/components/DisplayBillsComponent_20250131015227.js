import React from 'react';

import BillingCardComponent from './BillingCardComponent';
import { EmptyDataComponent } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';

const DisplayBillsComponent = ({ bills = [], t }) => (
  <div className="row">
    {!bills.length ? (
      <EmptyDataComponent message={t('message.empty_bill')} />
    ) : (
      bills.map((bill) => <BillingCardComponent key={bill.id} bill={bill} />)
    )}
  </div>
);

export default withTranslation('common')(DisplayBillsComponent);
