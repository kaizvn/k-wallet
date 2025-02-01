import { flow, get } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import { GetAllCoinsCreator } from '@revtech/rev-shared/apis/creators';

const GetAllCoinsAPI = GetAllCoinsCreator(`
    logo
    name
`);

export const getAllCoins = () => {
  return respondToSuccess(GetAllCoinsAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error('Err:', resp.errors);
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
