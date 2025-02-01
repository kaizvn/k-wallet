import React from 'react';

const OverviewProgressBarComponent = ({
  extraClassName,
  extraProgressClassName,
  title,
  amountProgess,
  amountDue,
  amountQA,
  amountDelegated,
  progressNow,
  dueNow,
  qaNow,
  delegatedNow
}) => (
  <div className={extraClassName}>
    <div className="ks-label">{title}</div>
    <div className="ks-progress">
      <div className="progress ks-progress-xs">
        <div
          className={`progress-bar ${extraProgressClassName}`}
          role="progressbar"
          style={{ width: amountProgess }}
          aria-valuenow={progressNow}
          aria-valuemin="0"
          aria-valuemax="100"
        />
        <div
          className="progress-bar ks-task-due-bar"
          role="progressbar"
          style={{ width: amountDue }}
          aria-valuenow={dueNow}
          aria-valuemin="0"
          aria-valuemax="100"
        />
        <div
          className="progress-bar ks-task-qa-bar"
          role="progressbar"
          style={{ width: amountQA }}
          aria-valuenow={qaNow}
          aria-valuemin="0"
          aria-valuemax="100"
        />
        <div
          className="progress-bar ks-task-delegated-bar"
          role="progressbar"
          style={{ width: amountDelegated }}
          aria-valuenow={delegatedNow}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  </div>
);

export default OverviewProgressBarComponent;
