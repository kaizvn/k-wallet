import { get, flow } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import { GetAllCoinsCreator } from '@revtech/rev-shared/apis/creators';

const GetAllCoinsAPI = GetAllCoinsCreator();

export const getAllCoins = () => {
  return respondToSuccess(GetAllCoinsAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
      return;
    }
    return;
  });
};

export const getAllCoinsSelector = flow(
  GetAllCoinsAPI.dataSelector,
  get('data.get_all_coins')
);

export default {};
