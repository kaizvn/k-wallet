import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CardWidgetPaymentSimpleComponent = ({
  color,
  amount,
  icon,
  amountIcon,
  description,
  progressType
}) => (
  <div
    className={`ks-widget-payment-simple-amount-item ks-${color}`}
    style={{
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.1)'
    }}
  >
    <div className="payment-simple-amount-item-icon-block">
      <span className="ks-icon">
        <FontAwesomeIcon icon={icon} />
      </span>
    </div>

    <div className="payment-simple-amount-item-body">
      <div className="payment-simple-amount-item-amount"
       style={{ textAlign: 'center' }}>
        <span className="ks-amount">{amount}</span>
        <span className={`ks-amount-icon ks-icon-circled-${amountIcon}`} />
      </div>
      <div className="payment-simple-amount-item-description">
        {description} <span className="ks-progress-type">({progressType})</span>
      </div>
    </div>
  </div>
);

export default CardWidgetPaymentSimpleComponent;
