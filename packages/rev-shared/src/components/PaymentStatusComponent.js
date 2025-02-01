import React from 'react';
import cx from 'classnames';

import { STATUS } from '../../enums';

const {
  PAYMENT_CANCELLED,
  PAYMENT_FAILED,
  PAYMENT_FINISHED,
  PAYMENT_PENDING,
  PAYMENT_REJECTED,
  PAYMENT_REVERTED
} = STATUS;

const PaymentStatusComponent = ({ status }) => (
  <span
    className={cx('badge ks-circle', {
      'badge-info': status === PAYMENT_PENDING,
      'badge-success': status === PAYMENT_FINISHED,
      'badge-warning': status === PAYMENT_CANCELLED,
      'badge-primary': status === PAYMENT_REVERTED,
      'badge-danger': status === PAYMENT_REJECTED || status === PAYMENT_FAILED
    })}
  >
    {status}

    <style jsx>{`
      span {
        text-transform: capitalize;
      }
    `}</style>
  </span>
);
export default PaymentStatusComponent;
