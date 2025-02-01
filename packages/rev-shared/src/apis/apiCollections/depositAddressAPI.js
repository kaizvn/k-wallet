import { makeFetchAction } from 'redux-api-call';
import { CREATE_DEPOSIT_ADDRESS_API } from '../names';
import { gql } from '../../libs';

export const CreateDepositAddressAPI = makeFetchAction(
  CREATE_DEPOSIT_ADDRESS_API,
  gql`
    mutation($trackingId: String!, $coinId: String!) {
      create_deposit_address(trackingId: $trackingId, coinId: $coinId) {
        trackingId
        address
        coin {
          symbol
        }
      }
    }
  `
);
