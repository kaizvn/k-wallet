import { respondToSuccess } from '../libs';
import {
  GetAllPaymentsAPI,
  GetWithdrawTxInfoAPI,
  ApprovePendingTransactionAPI,
  RejectPendingTransactionAPI,
  ManualTransactionAPI
} from '../apiCollections/paymentAPI';

export const getAllPayments = callback => {
  return respondToSuccess(
    GetAllPaymentsAPI.actionCreator(),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};

export const getWithdrawTxInfo = args =>
  respondToSuccess(GetWithdrawTxInfoAPI.actionCreator(args), resp => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
      return;
    }
  });

export const approvePendingTransaction = (id, callback) =>
  respondToSuccess(
    ApprovePendingTransactionAPI.actionCreator({
      id
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );

export const rejectPendingTransaction = (id, callback) =>
  respondToSuccess(
    RejectPendingTransactionAPI.actionCreator({
      id
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );

export const manualTransaction = (hash, txId, callback) =>
  respondToSuccess(
    ManualTransactionAPI.actionCreator({ hash, txId }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
