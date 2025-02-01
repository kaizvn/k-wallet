import { makeFetchAction } from 'redux-api-call';
import { DELIVER_ORDER_API, REVERT_ORDER_API } from '../names';
import { gql } from '../../libs';

export const DeliveredOrderAPI = makeFetchAction(
  DELIVER_ORDER_API,
  gql`
    mutation($id: ID!) {
      set_is_delivery(id: $id) {
        id
        isDelivered
      }
    }
  `
);

export const RevertedOrderAPI = makeFetchAction(
  REVERT_ORDER_API,
  gql`
    mutation($id: ID!) {
      set_revert_delivery(id: $id) {
        id
        isDelivered
      }
    }
  `
);
