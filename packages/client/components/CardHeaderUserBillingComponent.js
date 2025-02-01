import React from 'react';
import { upperCase } from 'lodash/fp';
import { withTranslation } from '@revtech/rev-shared/i18n';

const getClassAndTextByBillType = (type, t) => {
  switch (type) {
    case 'BILL_DEPOSIT':
      return {
        className: 'ks-green',
        text: t('recent_billings.card.title.deposit')
      };
    case 'BILL_WITHDRAW':
      return {
        className: 'ks-purple',
        text: t('recent_billings.card.title.withdraw')
      };
    default:
      return {
        className: '',
        text: type
      };
  }
};

const CardHeaderUserBillingComponent = ({ billItem, t }) => {
  const { className, text } = getClassAndTextByBillType(billItem.type, t);
  return (
    <React.Fragment>
      <div
        className={`card ${className} ks-widget-payment-price-ratio p-3 rounded-0`}
      >
        {upperCase(text)}
      </div>
    </React.Fragment>
  );
};

export default withTranslation('dashboard')(CardHeaderUserBillingComponent);
