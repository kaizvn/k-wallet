import { flow, get } from 'lodash/fp';
import { GetAllProductsAPI } from '../apiCollections/productAPI';

export const allProductsSelector = flow(
  GetAllProductsAPI.dataSelector,
  get('data.get_all_products')
);
