import React from 'react';

import { BILL_WITHDRAW, BILL_DEPOSIT, BILL_TRANSFER } from '../enums/billType';

const BillTypesComponent = ({ type, t }) => {
  switch (type) {
    case BILL_DEPOSIT:
      return (
        <span className="badge badge-success-outline">
          {t('common:rev_shared.enums.type.bill.deposit')}
        </span>
      );
    case BILL_WITHDRAW:
      return (
        <span className="badge badge-danger-outline">
          {t('common:rev_shared.enums.type.bill.withdraw')}
        </span>
      );
    case BILL_TRANSFER:
      return (
        <span className="badge badge-info-outline">
          {t('common:rev_shared.enums.type.bill.withdraw')}
        </span>
      );
    default:
      return <span className="badge badge-default-outline">{type}</span>;
  }
};
export default BillTypesComponent;
