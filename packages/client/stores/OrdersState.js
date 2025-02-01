import { gql, getbackUrl } from '@revtech/rev-shared/libs';
import Router from 'next/router';
import {
  setOrderDelivered,
  setOrderReverted
} from '@revtech/rev-shared/apis/actions';

import { makeFetchAction } from 'redux-api-call';

import { flow, get } from 'lodash/fp';

import { createErrorSelector } from './UserState';
import { getTransactionsList } from './PartnerState';
import { respondToSuccess } from '../middlewares/api-reaction';
export const FILTER_ORDER = 'FILTER_TRANSACTION';
export const CREATE_WITHDRAW_BILL = 'CreateWithdrawBillAPI';
export const CREATE_WITHDRAW_TRANSACTION = 'CreateWithdrawTransactionAPI';

const CreateWithdrawTransactionAPI = makeFetchAction(
  CREATE_WITHDRAW_TRANSACTION,
  gql`
    mutation(
      $amount: Float!
      $coinId: String!
      $recipientAddress: String!
      $trackingId: String
    ) {
      create_withdraw_transaction(
        amount: $amount
        coinId: $coinId
        recipientAddress: $recipientAddress
        trackingId: $trackingId
      ) {
        id
        hash
      }
    }
  `
);

export const createWithdrawTransaction = args => {
  return respondToSuccess(
    CreateWithdrawTransactionAPI.actionCreator(args),
    resp => {
      if (resp.errors) {
        console.log('Err:', resp.errors);
        return;
      }

      const url = getbackUrl(Router.router.pathname, 'payments');
      Router.push(url);
      return;
    }
  );
};

export const withdrawDataSelector = flow(
  CreateWithdrawTransactionAPI.dataSelector,
  get('create_withdraw_transaction.data')
);

export const withdrawErrorSelector = createErrorSelector(
  CreateWithdrawTransactionAPI
);

const CreateWithdrawBillAPI = makeFetchAction(
  CREATE_WITHDRAW_BILL,
  gql`
    mutation(
      $trackingId: String!
      $coinId: String!
      $recipientAddress: String!
      $withdrawAmount: Float!
    ) {
      create_withdraw_bill(
        trackingId: $trackingId
        coinId: $coinId
        recipientAddress: $recipientAddress
        withdrawAmount: $withdrawAmount
      ) {
        id
        address
        trackingId
        coin {
          id
          symbol
        }
        status
        createdAt
      }
    }
  `
);

export const createWithdrawBill = ({
  trackingId,
  coinId,
  recipientAddress,
  withdrawAmount
}) => {
  return respondToSuccess(
    CreateWithdrawBillAPI.actionCreator({
      trackingId,
      coinId,
      recipientAddress,
      withdrawAmount
    }),
    resp => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      return;
    }
  );
};

export const withdrawBillSelector = flow(
  CreateWithdrawBillAPI.dataSelector,
  get('data.create_withdraw_bill')
);

export const setOrderDeliveredByUser = arg =>
  setOrderDelivered(arg, dispatcher => dispatcher(getTransactionsList));

export const setOrderRevertedByUser = arg =>
  setOrderReverted(arg, dispatcher => dispatcher(getTransactionsList));

export default {};
