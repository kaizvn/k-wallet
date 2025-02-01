import { respondToSuccess } from '../libs';
import { CreatePartnerNewWalletAPI } from '../apiCollections/walletAPI';

export const createPartnerWallets = ({ name, coinId, partnerId }, callback) => {
  return respondToSuccess(
    CreatePartnerNewWalletAPI.actionCreator({ name, coinId, partnerId }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err:', resp.errors);
        return;
      }
      typeof callback === 'function' && callback(store.dispatch);
      return;
    }
  );
};
