import { makeFetchAction } from 'redux-api-call';
import {
  GET_ALL_PAYMENTS_API,
  GET_WITHDRAW_TX_INFO_API,
  APPROVE_PENDING_TRANSACTION_API,
  REJECT_PENDING_TRANSACTION_API,
  MANUAL_TRANSACTION_API
} from '../names';
import { gql } from '../../libs';

const SWITCH_PAYMENT_FROM_TO_DATA = `
{
  ... on Partner {
    id
    name
  }
  ... on User {
    id
    fullName
  }
  ... on OutsiderWallet {
    address
  }
}
`;

export const GetAllPaymentsAPI = makeFetchAction(
  GET_ALL_PAYMENTS_API,
  gql`
    query {
      get_all_payments {
        id
        trackingId
        transactionHash
        blockHash
        coin {
          id
          symbol
        }
        order {
          id
        }
        from
          ${SWITCH_PAYMENT_FROM_TO_DATA}

        to
          ${SWITCH_PAYMENT_FROM_TO_DATA}

        amount
        status
        createdAt
      }
    }
  `
);

export const GetWithdrawTxInfoAPI = makeFetchAction(
  GET_WITHDRAW_TX_INFO_API,
  gql`
    query($amount: Float!, $coinId: String!, $recipientAddress: String!) {
      get_withdraw_tx_info(
        amount: $amount
        coinId: $coinId
        recipientAddress: $recipientAddress
      ) {
        coinId
        amount
        fee
      }
    }
  `
);

export const ApprovePendingTransactionAPI = makeFetchAction(
  APPROVE_PENDING_TRANSACTION_API,
  gql`
    mutation($id: ID!) {
      approve_pending_transaction(id: $id) {
        id
        hash
        status
      }
    }
  `
);

export const RejectPendingTransactionAPI = makeFetchAction(
  REJECT_PENDING_TRANSACTION_API,
  gql`
    mutation($id: ID!) {
      reject_pending_transaction(id: $id) {
        id
        hash
        status
      }
    }
  `
);

export const ManualTransactionAPI = makeFetchAction(
  MANUAL_TRANSACTION_API,
  gql`
    mutation($hash: String!, $txId: String!) {
      manual_transaction(hash: $hash, txId: $txId) {
        id
        hash
        status
      }
    }
  `
);
