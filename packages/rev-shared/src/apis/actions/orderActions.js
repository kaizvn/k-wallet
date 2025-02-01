import { respondToSuccess } from '../libs';
import {
  DeliveredOrderAPI,
  RevertedOrderAPI
} from '../apiCollections/orderAPI';

export const setOrderDelivered = (id, callback) =>
  respondToSuccess(
    DeliveredOrderAPI.actionCreator({ id }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
      }

      typeof callback === 'function' && callback(store.dispatch);
      return;
    }
  );

export const setOrderRevertedWithAction = (id, callback) =>
  respondToSuccess(
    RevertedOrderAPI.actionCreator({ id }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
      }
      typeof callback === 'function' && callback(store.dispatch);
      return;
    }
  );
