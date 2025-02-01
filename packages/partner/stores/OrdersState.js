import { gql, getbackUrl } from '@revtech/rev-shared/libs';
import {
  setOrderDelivered,
  setOrderReverted
} from '@revtech/rev-shared/apis/actions';
import { makeFetchAction } from 'redux-api-call';
import Router from 'next/router';

import { flow, get } from 'lodash/fp';

import { createErrorSelector } from './UserState';
import { getTransactionsList } from './PartnerState';
import { respondToSuccess } from '../middlewares/api-reaction';

const GET_ALL_ORDERS = 'GetAllOrdersAPI';

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

      const url = getbackUrl(Router.router.pathname, 'transactions');
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

export const setOrderDeliveredByPartner = arg =>
  setOrderDelivered(arg, dispatcher => dispatcher(getTransactionsList));

export const setOrderRevertedByPartner = arg =>
  setOrderReverted(arg, dispatcher => dispatcher(getTransactionsList));

const GetAllOrdersAPI = makeFetchAction(
  GET_ALL_ORDERS,
  gql`
    query($id: ID!) {
      get_orders(id: $id) {
        id
        trackingId
        address
        status
        currencyId
        amount
        actualAmount
        createdAt
        expiredAt
      }
    }
  `
);

export const getAllOrders = () =>
  respondToSuccess(GetAllOrdersAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getAllOrdersSelector = flow(
  GetAllOrdersAPI.dataSelector,
  get('data.get_orders')
);

export default {};
