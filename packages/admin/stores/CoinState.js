import { flow, path, get } from 'lodash/fp';
import { makeFetchAction } from 'redux-api-call';
import { respondToSuccess } from '../middlewares/api-reaction';
import { gql } from '@revtech/rev-shared/libs';
import { createErrorSelector } from './UserState';
import { getResetter } from '@revtech/rev-shared/apis/libs';
import Router from 'next/router';
import { parseExactlyWithNumberField } from '@revtech/rev-shared/utils';

export const UPDATE_COIN_STATUS = 'UpdateCoinStatusAPI';
export const UPDATE_COIN = 'UpdateCoinAPI';
export const ADD_NEW_COIN = 'AddNewCoinAPI';
const GET_QUICK_FILTER_COIN_LIST = 'GetQuickFilterCoinListAPI';
const GET_COIN_BY_ID = 'GetCoinByIdAPI';

const AddNewCoinAPI = makeFetchAction(
  ADD_NEW_COIN,
  gql`
    mutation(
      $id: ID!
      $name: String!
      $symbol: String!
      $logo: String
      $minimumWithdrawal: Float
      $minimumDeposit: Float
      $feePercentage: Float
      $feeFixed: Float
      $isCompoundSupport: Boolean
      $decimals: Float!
      $network: String!
      $isPFSupport: Boolean
      $contractAddress: String
    ) {
      add_new_coin(
        id: $id
        name: $name
        symbol: $symbol
        logo: $logo
        minimumWithdrawal: $minimumWithdrawal
        minimumDeposit: $minimumDeposit
        feePercentage: $feePercentage
        feeFixed: $feeFixed
        isCompoundSupport: $isCompoundSupport
        decimals: $decimals
        network: $network
        isPFSupport: $isPFSupport
        contractAddress: $contractAddress
      ) {
        symbol
        name
      }
    }
  `
);

export const AddNewCoinAPIResetter = getResetter(AddNewCoinAPI);

export const addNewCoin = (objectParams = {}) => {
  objectParams = parseExactlyWithNumberField({
    object: objectParams,
    specialField: ['contractAddress']
  });
  return respondToSuccess(AddNewCoinAPI.actionCreator(objectParams), (resp) => {
    if (resp.errors) {
      console.error('Err: ', resp.errors);
      return;
    }
    Router.push('/coins');
  });
};

export const addNewCoinErrorMessageSelector = createErrorSelector(
  AddNewCoinAPI
);

const UpdateCoinAPI = makeFetchAction(
  UPDATE_COIN,
  gql`
    mutation(
      $id: ID!
      $name: String!
      $symbol: String!
      $logo: String
      $minimumWithdrawal: Float
      $minimumDeposit: Float
      $feePercentage: Float
      $feeFixed: Float
      $isCompoundSupport: Boolean
      $decimals: Float!
      $marginPercentage: Float
      $isPFSupport: Boolean
      $contractAddress: String
    ) {
      update_coin(
        id: $id
        name: $name
        symbol: $symbol
        logo: $logo
        minimumWithdrawal: $minimumWithdrawal
        minimumDeposit: $minimumDeposit
        feePercentage: $feePercentage
        feeFixed: $feeFixed
        isCompoundSupport: $isCompoundSupport
        decimals: $decimals
        marginPercentage: $marginPercentage
        isPFSupport: $isPFSupport
        contractAddress: $contractAddress
      ) {
        symbol
        name
      }
    }
  `
);

export const UpdateCoinAPIResetter = getResetter(UpdateCoinAPI);

export const updateCoin = (objectParams = {}) => {
  objectParams = parseExactlyWithNumberField({
    object: objectParams,
    specialField: ['contractAddress']
  });
  return respondToSuccess(UpdateCoinAPI.actionCreator(objectParams), (resp) => {
    if (resp.errors) {
      console.error('Err: ', resp.errors);
      return;
    }
  });
};
export const updateCoinSuccessMessageSelector = flow(
  UpdateCoinAPI.dataSelector,
  path('data.update_coin')
);
export const updateCoinErrorMessageSelector = createErrorSelector(
  UpdateCoinAPI
);

const GetQuickFilterCoinListAPI = makeFetchAction(
  GET_QUICK_FILTER_COIN_LIST,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_coins(filter: $filter) {
        coins {
          id
          name
          symbol
          logo
          status
          createdAt
          isCompoundSupport
          feePercentage
          feeFixed
          minimumWithdrawal
          decimals
          network
          isPFSupport
          contractAddress
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

export const getQuickFilterCoinList = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterCoinListAPI.actionCreator({
      filter: { page, pageSize, filterContents, dateRange }
    }),
    (resp) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      return;
    }
  );

export const GetQuickFilterCoinListSelector = flow(
  GetQuickFilterCoinListAPI.dataSelector,
  get('data.get_quick_filter_coins')
);

export const GetQuickFilterCoinListErrorSelector = createErrorSelector(
  GetQuickFilterCoinListAPI
);

const UpdateCoinStatusAPI = makeFetchAction(
  UPDATE_COIN_STATUS,
  gql`
    mutation($id: ID!, $action: UpdateCoinStatusAction!) {
      update_coin_status(id: $id, action: $action) {
        status
        id
      }
    }
  `
);

export const updateCoinStatus = ({ id, action }) =>
  respondToSuccess(
    UpdateCoinStatusAPI.actionCreator({ id, action }),
    (resp, header, store) => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }
      store.dispatch(getQuickFilterCoinList({}));
      store.dispatch(getCoinById(id));
    }
  );

const GetCoinByIdAPI = makeFetchAction(
  GET_COIN_BY_ID,
  gql`
    query($id: ID!) {
      get_coin(id: $id) {
        id
        name
        symbol
        logo
        status
        createdAt
        minimumWithdrawal
        minimumDeposit
        feePercentage
        feeFixed
        isCompoundSupport
        marginPercentage
        decimals
        isPFSupport
        contractAddress
        network
      }
    }
  `
);
export const getCoinById = (id) =>
  respondToSuccess(GetCoinByIdAPI.actionCreator({ id }), (resp) => {
    if (resp.errors) {
      console.error('Err: ', resp.errors);
      return;
    }
    return;
  });

export const getCoinByIdSelector = flow(
  GetCoinByIdAPI.dataSelector,
  get('data.get_coin')
);

export const GetCoinByIdAPIResetter = getResetter(GetCoinByIdAPI);
