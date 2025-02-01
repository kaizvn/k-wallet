import { flow, get } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import { GetMyWalletsCreator } from '@revtech/rev-shared/apis/creators';

const GetMyWalletsAPI = GetMyWalletsCreator();

export const getMyWallets = () => {
  return respondToSuccess(GetMyWalletsAPI.actionCreator(), resp => {
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
