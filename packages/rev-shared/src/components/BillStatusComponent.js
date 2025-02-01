import React from 'react';
import cx from 'classnames';

import {
  BILL_CLOSED,
  BILL_CONFIRMED,
  BILL_CREATED,
  BILL_EXPIRED,
  BILL_FAILED,
  BILL_HOLD,
  BILL_NOT_ENOUGH_FUND,
  BILL_PAID,
  BILL_PENDING,
  BILL_REVERTED
} from '../enums/status';

const getBillStatusLabel = ({ status, t }) => {
  switch (status) {
    case BILL_CLOSED:
      return t('common:rev_shared.enums.status.bill.closed');
    case BILL_CONFIRMED:
      return t('common:rev_shared.enums.status.bill.confirmed');
    case BILL_CREATED:
      return t('common:rev_shared.enums.status.bill.created');
    case BILL_EXPIRED:
      return t('common:rev_shared.enums.status.bill.expired');
    case BILL_FAILED:
      return t('common:rev_shared.enums.status.bill.failed');
    case BILL_HOLD:
      return t('common:rev_shared.enums.status.bill.hold');
    case BILL_NOT_ENOUGH_FUND:
      return t('common:rev_shared.enums.status.bill.not_enough_fund');
    case BILL_PAID:
      return t('common:rev_shared.enums.status.bill.paid');
    case BILL_PENDING:
      return t('common:rev_shared.enums.status.bill.pending');
    case BILL_REVERTED:
      return t('common:rev_shared.enums.status.bill.reverted');
    default:
      return '';
  }
};

const BillStatusComponent = ({ status, t }) => (
  <span
    className={cx('badge ks-circle', {
      'badge-info': status === BILL_PENDING || status === BILL_CREATED,
      'badge-danger':
        status === BILL_EXPIRED ||
        status === BILL_REVERTED ||
        status === BILL_FAILED ||
        status === BILL_CLOSED,
      'badge-success': status === BILL_CONFIRMED,
      'badge-warning': status === BILL_HOLD || status === BILL_NOT_ENOUGH_FUND,
      'badge-primary': status === BILL_PAID
    })}
  >
    {getBillStatusLabel({ status, t })}
  </span>
);
export default BillStatusComponent;
