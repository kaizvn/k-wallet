import { makeFetchAction } from 'redux-api-call';
import { flow, get } from 'lodash/fp';
import { gql } from '@revtech/rev-shared/libs';
import { respondToSuccess } from '../middlewares/api-reaction';
import { GetMyWalletsCreator } from '@revtech/rev-shared/apis/creators';
import { createErrorSelector } from './UserState';
import { getResetter } from '@revtech/rev-shared/apis/libs';

const GET_PARTNER_WALLETS = 'GetPartnerWalletsAPI';
const GET_USER_WALLETS = 'GetUserWalletsAPI';
const GET_EWALLETS_BY_COIN_ID = 'GetQuickFilterEWalletsByCoinIdAPI';
export const SYNC_EWALLET_WITH_NETWORK = 'SyncEWalletWithNetWork';
export const RE_NEW_DEPOSIT_ADDRESS = 'ReNewDepositAddress';

export const ReNewDepositAddressAPI = makeFetchAction(
  RE_NEW_DEPOSIT_ADDRESS,
  gql`
    mutation(
      $username: String!
      $trackingId: String
      $coinId: String!
      $emptyDepositAddresses: Boolean
    ) {
      renew_deposit_address(
        username: $username
        trackingId: $trackingId
        coinId: $coinId
        emptyDepositAddresses: $emptyDepositAddresses
      )
    }
  `
);

export const reNewDepositAddress = ({
  username,
  trackingId = '',
  coinId,
  emptyDepositAddresses
}) =>
  respondToSuccess(
    ReNewDepositAddressAPI.actionCreator({
      username,
      trackingId,
      coinId,
      emptyDepositAddresses
    }),
    (resp) => {
      if (resp.errors) {
        console.error('Errors: ', resp.errors);
        return;
      }
      return;
    }
  );

export const ReNewDepositAddressDataSelector = flow(
  ReNewDepositAddressAPI.dataSelector,
  get('data.renew_deposit_address')
);

export const ReNewDepositAddressErrorSelector = createErrorSelector(
  ReNewDepositAddressAPI
);

export const ReNewDepositAddressResettor = getResetter(ReNewDepositAddressAPI);

const SyncEWalletWithNetWorkAPI = makeFetchAction(
  SYNC_EWALLET_WITH_NETWORK,
  gql`
    mutation($arrayId: [String!], $options: OptionGetAddress) {
      sync_ewallet_with_network(arrayId: $arrayId, options: $options) {
        id
        coin {
          id
          name
          symbol
          logo
        }
        balance
      }
    }
  `
);

export const syncEWalletWithNetwork = ({ arrayId = [], options = {} }) =>
  respondToSuccess(
    SyncEWalletWithNetWorkAPI.actionCreator({ arrayId, options }),
    (resp) => {
      if (resp.errors) {
        console.error('Errors: ', resp.errors);
        return;
      }
      return;
    }
  );

export const SyncEWalletWithNetWorkDataSelector = flow(
  SyncEWalletWithNetWorkAPI.dataSelector,
  get('data.sync_ewallet_with_network')
);

export const SyncEWalletWithNetWorkErrorSelector = createErrorSelector(
  SyncEWalletWithNetWorkAPI
);

export const SyncEWalletWithNetWorkResettor = getResetter(
  SyncEWalletWithNetWorkAPI
);

const GetMyWalletsAPI = GetMyWalletsCreator();

export const getMyWallets = () => {
  return respondToSuccess(GetMyWalletsAPI.actionCreator(), (resp) => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
      return;
    }

    return;
  });
};

export const myWalletsSelector = flow(
  GetMyWalletsAPI.dataSelector,
  get('data.get_my_ewallets')
);

const GetPartnerWalletsAPI = makeFetchAction(
  GET_PARTNER_WALLETS,
  gql`
    query($partnerId: ID) {
      get_partner_ewallets(partnerId: $partnerId) {
        id
        balance
        name
        owner {
          ... on Partner {
            id
            name
          }
          ... on User {
            id
            fullName
          }
        }
        coin {
          id
          name
          symbol
          logo
        }
      }
    }
  `
);

export const getPartnerWallets = (partnerId) => {
  return respondToSuccess(
    GetPartnerWalletsAPI.actionCreator({ partnerId }),
    (resp) => {
      if (resp.errors) {
        console.log('Err:', resp.errors);
        return;
      }

      return;
    }
  );
};

export const partnerWalletsSelector = flow(
  GetPartnerWalletsAPI.dataSelector,
  get('data.get_partner_ewallets')
);

const GetUserWalletsAPI = makeFetchAction(
  GET_USER_WALLETS,
  gql`
    query($id: ID!) {
      get_user_ewallets(id: $id) {
        id
        balance
        name
        owner {
          ... on Partner {
            id
            name
          }
          ... on User {
            id
            fullName
          }
        }
        coin {
          id
          name
          symbol
          logo
        }
      }
    }
  `
);

export const getUserWallets = (id) => {
  return respondToSuccess(GetUserWalletsAPI.actionCreator({ id }), (resp) => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
      return;
    }

    return;
  });
};

export const userWalletsSelector = flow(
  GetUserWalletsAPI.dataSelector,
  get('data.get_user_ewallets')
);

const GetEWalletsByCoinIdAPI = makeFetchAction(
  GET_EWALLETS_BY_COIN_ID,
  gql`
    query($coinId: ID, $filter: FilterTable!) {
      get_quick_filter_ewallets_by_coin_id(coinId: $coinId, filter: $filter) {
        ewallets {
          id
          name
          balance
          isSynchronizing
          owner {
            ... on Partner {
              name
            }
            ... on User {
              fullName
            }
          }
          coin {
            id
            symbol
            name
            logo
          }
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

export const getQuickFilterEWalletsByCoinId = ({
  page,
  pageSize,
  filterContents,
  coinId,
  dateRange
}) =>
  respondToSuccess(
    GetEWalletsByCoinIdAPI.actionCreator({
      coinId,
      filter: { page, pageSize, filterContents, dateRange }
    }),
    (resp) => {
      if (resp.errors) {
        console.log('Err:', resp.errors);
        return;
      }
      return;
    }
  );

export const getQuickFilterEWalletsByCoinIdSelector = flow(
  GetEWalletsByCoinIdAPI.dataSelector,
  get('data.get_quick_filter_ewallets_by_coin_id')
);

export const getQuickFilterEWalletsByCoinIdErrorSelector = createErrorSelector(
  GetEWalletsByCoinIdAPI
);

export default {
  addState: (state = false, { type, payload }) => {
    if (type === 'ADD_NEW_WALLET') {
      return false;
    }

    if (type === 'CALL_ADD_WALLET') {
      if (payload) {
        return false;
      }
      return true;
    }
    return state;
  }
};
