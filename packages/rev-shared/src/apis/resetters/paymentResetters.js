import {
  GetWithdrawTxInfoAPI,
  ManualTransactionAPI
} from '../apiCollections/paymentAPI';
import { getResetter } from '../libs';

export const getWithdrawTxInfoResetter = getResetter(GetWithdrawTxInfoAPI);

export const manualTransactionResetter = getResetter(ManualTransactionAPI);
