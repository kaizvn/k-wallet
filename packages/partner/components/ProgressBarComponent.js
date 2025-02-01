import React from 'react';

const ProgressBarComponent = ({
  extraClassName,
  extraProgressClassName,
  title,
  amount,
  valuenow,
  valuemax
}) => (
  <div className={extraClassName}>
    <span className="ks-name">{title}</span>
    <div className="progress ks-progress-xs">
      <div
        className={`progress-bar ${extraProgressClassName}`}
        role="progressbar"
        style={{ width: amount }}
        aria-valuenow={valuenow}
        aria-valuemin="0"
        aria-valuemax={valuemax}
      />
    </div>
    <span className="ks-amount">{amount}</span>
  </div>
);

export default ProgressBarComponent;
