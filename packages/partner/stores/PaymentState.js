import { flow, get } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import { GetAllCoinsCreator } from '@revtech/rev-shared/apis/creators';
import { makeFetchAction } from 'redux-api-call';
import { gql } from '@revtech/rev-shared/dist/libs';
export const RESEND_CALLBACK_API = 'ReSendCallbackAPI';

const ReSendCallbackAPI = makeFetchAction(
  RESEND_CALLBACK_API,
  gql`
    mutation($id: ID!) {
      resend_callback(id: $id) {
        bill {
          id
        }
      }
    }
  `
);
export const reSendCallBack = id => {
  return respondToSuccess(
    ReSendCallbackAPI.actionCreator({
      id
    }),
    resp => {
      if (resp.errors) {
        console.log('Error: ', resp.errors);
        return;
      }
      return;
    }
  );
};

const GetAllCoinsAPI = GetAllCoinsCreator(`
    logo
    name
    marginPercentage
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
