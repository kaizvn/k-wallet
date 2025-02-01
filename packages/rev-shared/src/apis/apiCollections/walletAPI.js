import { makeFetchAction } from 'redux-api-call';
import { CREATE_PARTNER_NEW_WALLET_API } from '../names';
import { gql } from '../../libs';

export const CreatePartnerNewWalletAPI = makeFetchAction(
  CREATE_PARTNER_NEW_WALLET_API,
  gql`
    mutation($name: String!, $coinId: ID!, $partnerId: String!) {
      create_partner_ewallet(
        name: $name
        coinId: $coinId
        partnerId: $partnerId
      ) {
        id
        name
        coin {
          id
        }
        balance
        createdAt
      }
    }
  `
);
