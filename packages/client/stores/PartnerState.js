import { PaymentCoinInfo } from '@revtech/rev-shared/utils';
import { GetQuickFilterTransactionsCreator } from '@revtech/rev-shared/apis/creators';
import { gql } from '@revtech/rev-shared/libs';
import { makeFetchAction } from 'redux-api-call';

import { flow, get } from 'lodash/fp';

import { createErrorSelector } from './UserState';
import { getMyWallets } from './WalletState';
import { respondToSuccess } from '../middlewares/api-reaction';
import { sendToUser } from '@revtech/rev-shared/apis/actions';

const GET_TRANSACTIONS_LIST = 'GetTransactionsListAPI';

const SWITCH_TRANSACTION_FROM_TO_DATA = `
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
`;
const GetTransactionsListAPI = makeFetchAction(
  GET_TRANSACTIONS_LIST,
  gql`
    query {
      get_all_transactions {
        id
        bill {
          id
        }
        from {
          ${SWITCH_TRANSACTION_FROM_TO_DATA}
        }
        to {
        ${SWITCH_TRANSACTION_FROM_TO_DATA}
        }
        amount
        status
        coin {
          symbol
        }
        description
        createdAt
      }
    }
  `
);

export const getTransactionsList = () =>
  respondToSuccess(GetTransactionsListAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getTransactionsListSelector = flow(
  GetTransactionsListAPI.dataSelector,
  get('data.get_all_transactions')
);

export const sendToUserByUser = args =>
  sendToUser(args, dispatcher => dispatcher(getMyWallets));

const GetQuickFilterTransactionsAPI = GetQuickFilterTransactionsCreator();

export const getQuickFilterTransactionsList = ({
  page = 0,
  pageSize = 9,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterTransactionsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: filterContents.trim(),
        dateRange
      }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }
      return;
    }
  );

export const getQuickFilterTransactionsListSelector = flow(
  GetQuickFilterTransactionsAPI.dataSelector,
  get('data.get_quick_filter_transactions')
);

export const getQuickFilterTransactionsErrorSelector = createErrorSelector(
  GetQuickFilterTransactionsAPI
);

export default {
  paymentCoinInfo: (state = PaymentCoinInfo) => {
    return state;
  },
  availableWithdrawal: (state = 10) => {
    return state;
  },
  transactionFee: (state = 0.01) => {
    return state;
  }
};
