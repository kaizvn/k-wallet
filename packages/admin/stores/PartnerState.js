import { makeFetchAction } from 'redux-api-call';

import { flow, get } from 'lodash/fp';

import { PaymentCoinInfo } from '@revtech/rev-shared/utils';
import { createErrorSelector } from './UserState';
import { getMyWallets } from './WalletState';
import { gql } from '@revtech/rev-shared/libs';
import { createPartnerWallets } from '@revtech/rev-shared/apis/actions';
import {
  GetQuickFilterTransactionsCreator,
  GetQuickFilterPendingTransactionsCreator
} from '@revtech/rev-shared/apis/creators';
import { respondToSuccess } from '../middlewares/api-reaction';

export const LOGIN_PARTNER_USER_API = 'LoginParterUserAPI';
const GET_TRANSACTIONS_LIST = 'GetTransactionsListAPI';
const GET_PENDING_TRANSACTIONS_LIST = 'GetPendingTransactionsListAPI';
export const APPROVE_PENDING_TRANSACTION = 'ApprovePendingTransactionAPI';

const ApprovePendingTransactionAPI = makeFetchAction(
  APPROVE_PENDING_TRANSACTION,
  gql`
    mutation($id: ID) {
      approve_pending_transaction_by_admin(id: $id) {
        id
      }
    }
  `
);

export const approvePendingTransaction = id =>
  respondToSuccess(ApprovePendingTransactionAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    return;
  });

export const getApprovePendingTransactionErrorSelector = createErrorSelector(
  ApprovePendingTransactionAPI
);

export const resetApprovePendingTransaction = dispatch => {
  dispatch(GetPendingTransactionsListAPI.resetter(['data', 'error']));
  dispatch(ApprovePendingTransactionAPI.resetter(['data', 'error']));
};

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
    query ($filter: FilterTable){
      get_all_transactions (filter: $filter){
    transactions  {
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
      pageInfos {
        totalCount
        filter {
          page
          pageSize
        }
      }
    }
}
  `
);

export const getTransactionsList = ({ page = 0, pageSize = 10 }) => {
  return respondToSuccess(
    GetTransactionsListAPI.actionCreator({ filter: { page, pageSize } }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      return;
    }
  );
};

export const getTransactionsListSelector = flow(
  GetTransactionsListAPI.dataSelector,
  get('data.get_all_transactions')
);

export const createPartnerWalletsByAdmin = args =>
  createPartnerWallets(args, dispatcher => dispatcher(getMyWallets));

const GetQuickFilterTransactionsAPI = GetQuickFilterTransactionsCreator();

const GetQuickFilterPendingTransactionsAPI = GetQuickFilterPendingTransactionsCreator();

export const getQuickFilterTransactionsList = ({
  page = 0,
  pageSize = 10,
  searchMessage = '',
  dateRange
}) => {
  return respondToSuccess(
    GetQuickFilterTransactionsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: searchMessage.trim(),
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
};

export const getQuickFilterPendingTransactions = ({
  page = 0,
  pageSize = 10,
  searchMessage = '',
  dateRange
}) => {
  return respondToSuccess(
    GetQuickFilterPendingTransactionsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: searchMessage.trim(),
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
};

export const getQuickFilterTransactionsListSelector = flow(
  GetQuickFilterTransactionsAPI.dataSelector,
  get('data.get_quick_filter_transactions')
);

export const getQuickFilterPendingTransactionsSelector = flow(
  GetQuickFilterPendingTransactionsAPI.dataSelector,
  get('data.get_quick_filter_pending_transactions')
);

const GetPendingTransactionsListAPI = makeFetchAction(
  GET_PENDING_TRANSACTIONS_LIST,
  gql`
    query{
      get_required_admin_approval_transactions   {
        id
        type
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
          logo
        }
        hashUrl
        hash
        createdAt
    }
}
  `
);

export const getPendingTransactions = () => {
  return respondToSuccess(
    GetPendingTransactionsListAPI.actionCreator(),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      return;
    }
  );
};

export const getPendingTransactionsSelector = flow(
  GetPendingTransactionsListAPI.dataSelector,
  get('data.get_required_admin_approval_transactions')
);
export const getPendingTransactionsErrorSelector = createErrorSelector(
  GetPendingTransactionsListAPI
);

export const getQuickFilterTransactionsErrorSelector = createErrorSelector(
  GetQuickFilterTransactionsAPI
);

export const getQuickFilterPendingTransactionsErrorSelector = createErrorSelector(
  GetQuickFilterPendingTransactionsAPI
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
