import { respondToSuccess } from '../libs';
import { CreateDepositAddressAPI } from '../apiCollections/depositAddressAPI';

export const createDepositAddress = ({ trackingId, coinId }, callback) => {
  return respondToSuccess(
    CreateDepositAddressAPI.actionCreator({
      trackingId,
      coinId
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);
    }
  );
};
