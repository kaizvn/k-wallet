import React from 'react';

import CardWidgetTitleComponent from './CardWidgetTitleComponent';

const CardTotalAmountComponent = ({
  title,
  icon,
  color,
  amount,
  description
}) => (
  <div
    className={`card ks-card-widget ks-widget-payment-total-amount ks-${color}-light`}
  >
    <CardWidgetTitleComponent title={title} />
    <div className="card-block">
      <div className="ks-payment-total-amount-item-icon-block">
        <span className={`${icon} ks-icon`} />
      </div>

      <div className="ks-payment-total-amount-item-body">
        <div className="ks-payment-total-amount-item-amount">
          <span className="ks-amount">{amount}</span>
        </div>
        <div className="ks-payment-total-amount-item-description">
          {description}
        </div>
      </div>
    </div>
  </div>
);

export default CardTotalAmountComponent;
