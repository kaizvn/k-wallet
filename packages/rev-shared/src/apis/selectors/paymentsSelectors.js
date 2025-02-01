import { flow, get } from 'lodash/fp';
import { createErrorSelector } from '../libs';
import {
  GetAllPaymentsAPI,
  GetWithdrawTxInfoAPI,
  ManualTransactionAPI
} from '../apiCollections/paymentAPI';

export const allPaymentsSelector = flow(
  GetAllPaymentsAPI.dataSelector,
  get('data.get_all_payments')
);

export const getWithdrawEstFeeSelector = flow(
  GetWithdrawTxInfoAPI.dataSelector,
  get('data.get_withdraw_tx_info.fee')
);

export const getWithdrawEstFeeErrorSelector = createErrorSelector(
  GetWithdrawTxInfoAPI
);

export const manualTransactionDataSelector = flow(
  ManualTransactionAPI.dataSelector,
  get('data.manual_transaction')
);

export const manualTransactionErrorSelector = createErrorSelector(
  ManualTransactionAPI
);
