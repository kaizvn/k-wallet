import { makeFetchAction } from 'redux-api-call';
import Router from 'next/router';

import { flow, get } from 'lodash/fp';
import { getTransactionsList } from './PartnerState';
import { getbackUrl, gql } from '@revtech/rev-shared/libs';
import {
  setOrderDelivered,
  setOrderReverted
} from '@revtech/rev-shared/apis/actions';
import { respondToSuccess } from '../middlewares/api-reaction';
export const CREATE_WITHDRAW_ORDER = 'CreateWithdrawOrderAPI';

const CreateWithdrawOrderAPI = makeFetchAction(
  CREATE_WITHDRAW_ORDER,
  gql`
    mutation(
      $trackingId: String!
      $coinId: String!
      $recipientAddress: String!
      $withdrawAmount: Float!
    ) {
      create_withdraw_order(
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

export const createWithdrawOrder = ({
  trackingId,
  coinId,
  recipientAddress,
  withdrawAmount
}) => {
  return respondToSuccess(
    CreateWithdrawOrderAPI.actionCreator({
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
      const url = getbackUrl(Router.router.pathname, 'payment');
      Router.push(url);
      return;
    }
  );
};

export const withdrawOrderSelector = flow(
  CreateWithdrawOrderAPI.dataSelector,
  get('data.create_withdraw_order')
);

export const setOrderDeliveredByAdmin = arg =>
  setOrderDelivered(arg, dispatcher => dispatcher(getTransactionsList));

export const setOrderRevertedByAdmin = arg =>
  setOrderReverted(arg, dispatcher => dispatcher(getTransactionsList));

export default {};
