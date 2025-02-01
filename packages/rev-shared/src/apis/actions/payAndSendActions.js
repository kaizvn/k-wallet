import { respondToSuccess } from '../libs';
import {
  SendToUserAPI,
  PayToPartnerAPI,
  PayHeiauAPI
} from '../apiCollections/payAndSendAPI';

const ORDER_TRANSFER = 'ORDER_TRANSFER';
const ORDER_PURCHASE = 'ORDER_PURCHASE';

export const sendToUser = (
  { coinId, username, amount, tx_type = ORDER_TRANSFER },
  callback
) => {
  return respondToSuccess(
    SendToUserAPI.actionCreator({ coinId, username, amount, tx_type }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};

export const payToPartner = (
  { coinId, partnerId, amount, description, tx_type = ORDER_PURCHASE },
  callback
) => {
  return respondToSuccess(
    PayToPartnerAPI.actionCreator({
      coinId,
      partnerId,
      amount,
      description,
      tx_type
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};

export const payHeiau = ({ data }, callback) =>
  respondToSuccess(PayHeiauAPI.actionCreator(data), (resp, headers, store) => {
    if (resp.errors) {
      console.error(resp.errors);
    }

    typeof callback === 'function' && callback(store.dispatch);

    return;
  });
