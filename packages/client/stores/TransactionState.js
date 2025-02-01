import { gql } from '@revtech/rev-shared/libs';
import { makeFetchAction } from 'redux-api-call';
import { flow, get } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';

const GET_TRANSACTION_BY_ID = 'GetTransactionByIdAPI';

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
const SWITCH_BILL_FROM_TO_DATA = `
... on Partner {
  id
  name
}
... on User {
  id
  fullName
}
`;

const GetTransactionByIdAPI = makeFetchAction(
  GET_TRANSACTION_BY_ID,
  gql`
        query($id: ID!) {
            get_transaction(id: $id) {
                id
                bill {
                    id
                    address
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
                    coin {
                        id
                        name
                        symbol
                        logo
                    }
                    owner {
                        ${SWITCH_BILL_FROM_TO_DATA}
                    }
                }
                from {
                    ${SWITCH_TRANSACTION_FROM_TO_DATA}
                }
                to {
                    ${SWITCH_TRANSACTION_FROM_TO_DATA}
                }
                amount
                status
                type
                coin {
                    id
                    name
                    symbol
                    logo
                }
                description
                createdAt
                receivedAddress
                fee
            }
        }
    `
);

export const getTransactionById = id => {
  return respondToSuccess(GetTransactionByIdAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
      return;
    }
    return;
  });
};

export const getTransactionByIdSelector = flow(
  GetTransactionByIdAPI.dataSelector,
  get('data.get_transaction')
);

export default {};
