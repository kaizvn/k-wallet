import React from 'react';
import {
  TRANSACTION_DEPOSIT,
  TRANSACTION_TRANSFER,
  TRANSACTION_WITHDRAW
} from '../enums/transactionType';

const TransactionTypesComponent = ({ type, t }) => {
  switch (type) {
    case TRANSACTION_DEPOSIT:
      return (
        <span className="badge badge-success-outline">
          {t('common:rev_shared.enums.type.transaction.deposit')}
        </span>
      );
    case TRANSACTION_WITHDRAW:
      return (
        <span className="badge badge-danger-outline">
          {t('common:rev_shared.enums.type.transaction.withdraw')}
        </span>
      );
    case TRANSACTION_TRANSFER:
      return (
        <span className="badge badge-info-outline">
          {t('common:rev_shared.enums.type.transaction.transfer')}
        </span>
      );
    default:
      return <span className="badge badge-default-outline">{type}</span>;
  }
};
export default TransactionTypesComponent;
