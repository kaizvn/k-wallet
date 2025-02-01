import React from 'react';

const CardWidgetPaymentPriceComponent = ({
  color,
  title,
  amount,
  icon,
  description
}) => (
  <div className={`card ks-widget-payment-price-ratio ks-${color}`}>
    <div className="ks-price-ratio-title">{title}</div>
    <div className="ks-price-ratio-amount">{amount}</div>
    <div className="ks-price-ratio-progress">
      <span className={`ks-icon ks-icon-circled-${icon}`} />
      <div className="ks-text">{description}</div>
    </div>
  </div>
);
export default CardWidgetPaymentPriceComponent;
