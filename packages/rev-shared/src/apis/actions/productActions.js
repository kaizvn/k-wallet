import { respondToSuccess } from '../libs';
import { GetAllProductsAPI } from '../apiCollections/productAPI';

export const getAllProducts = (data, callback) =>
  respondToSuccess(
    GetAllProductsAPI.actionCreator(data),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
