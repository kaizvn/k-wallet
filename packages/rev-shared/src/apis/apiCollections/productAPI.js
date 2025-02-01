import { makeFetchAction } from 'redux-api-call';
import { GET_ALL_PRODUCTS_API } from '../names';
import { gql } from '../../libs';

export const GetAllProductsAPI = makeFetchAction(
  GET_ALL_PRODUCTS_API,
  gql`
    query {
      get_all_products {
        id
        name
        sku
        price
      }
    }
  `
);
