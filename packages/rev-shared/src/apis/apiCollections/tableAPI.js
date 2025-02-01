import { makeFetchAction } from 'redux-api-call';
import { GET_QUICK_FILTER_PAYMENTS_LIST_API } from '../names';
import { gql } from '../../libs';

const SWITCH_TRANSACTION_FROM_TO_DATA = `
... on Partner {
  id
  name
}
... on User {
  id
  fullName
}
... on OutsiderWallet {
  address
}
`;

export const GetQuickFilterPaymentsListAPI = makeFetchAction(
  GET_QUICK_FILTER_PAYMENTS_LIST_API,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_payments(filter: $filter) {
        transactions {
          type
          id
          to {
            ${SWITCH_TRANSACTION_FROM_TO_DATA}
          }
          amount
          status
          coin {
            symbol
            logo
            name
          }
          hashUrl
          hash
          createdAt
          trackingId
          receivedAddress
          fee
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
          }
        }
      }
    }
  `
);
