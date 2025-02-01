import { makeFetchAction } from 'redux-api-call';
import { PAY_TO_PARTNER_API, SEND_TO_USER_API, PAY_HEIAU_API } from '../names';
import { gql } from '../../libs';

export const PayToPartnerAPI = makeFetchAction(
  PAY_TO_PARTNER_API,
  gql`
    mutation(
      $coinId: String!
      $partnerId: String!
      $amount: Float!
      $description: String
      $tx_type: String
    ) {
      pay(
        coinId: $coinId
        partnerId: $partnerId
        amount: $amount
        description: $description
        tx_type: $tx_type
      ) {
        id
      }
    }
  `
);

export const SendToUserAPI = makeFetchAction(
  SEND_TO_USER_API,
  gql`
    mutation(
      $coinId: String!
      $username: String!
      $amount: Float!
      $tx_type: String
    ) {
      send(
        coinId: $coinId
        username: $username
        amount: $amount
        tx_type: $tx_type
      ) {
        id
      }
    }
  `
);

export const PayHeiauAPI = makeFetchAction(
  PAY_HEIAU_API,
  gql`
    mutation($partnerId: String!, $amount: Float!, $description: String) {
      pay_heiau(
        partnerId: $partnerId
        amount: $amount
        description: $description
      ) {
        id
      }
    }
  `
);
