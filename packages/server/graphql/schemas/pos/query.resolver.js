// import { combineResolvers } from 'graphql-resolvers';

// import { checkAuthorization } from '../../libs';

import { RevPOS } from '../../../services';

export default {
  Query: {
    get_all_products_orders: () => {
      const getOrders = RevPOS.getOrderList();
      return getOrders.then(
        result => {
          return JSON.parse(result);
        },
        err => {
          return err;
        }
      );
    },
    get_all_products: () => {
      const getProducts = RevPOS.getProductsList();
      return getProducts.then(
        result => {
          return JSON.parse(result);
        },
        err => {
          return err;
        }
      );
    }
  }
};
