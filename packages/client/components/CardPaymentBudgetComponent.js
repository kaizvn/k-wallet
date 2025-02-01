import React from 'react';

const CardPaymentBudgetComponent = ({
  imgLink,
  imgSrc,
  header,
  subtitle,
  children
}) => (
  <div className="card ks-card-widget ks-widget-payment-budget">
    <a href={imgLink} className="ks-thumbnail">
      <img alt="" src={imgSrc} className="embed-responsive" />
    </a>
    <a className="card-header">{header}</a>
    {subtitle}
    <div className="card-block">{children}</div>
  </div>
);
export default CardPaymentBudgetComponent;
