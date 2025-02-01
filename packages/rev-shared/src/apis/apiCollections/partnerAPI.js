import { makeFetchAction } from 'redux-api-call';
import {
  GET_PAID_PARTNER_DETAILS_API,
  GET_MEMBER_LIST_API,
  GET_PARTNER_MEMBER_DETAILS_API
} from '../names';
import { gql } from '../../libs';

export const GetPaidPartnerDetailsAPI = makeFetchAction(
  GET_PAID_PARTNER_DETAILS_API,
  gql`
    query($id: ID, $partnerId: String) {
      get_paid_partner(id: $id, partnerId: $partnerId) {
        id
        partnerId
        name
        email
        address
        phone
      }
    }
  `
);

export const GetMemberListAPI = makeFetchAction(
  GET_MEMBER_LIST_API,
  gql`
    query($partnerId: ID) {
      get_partner_members(partnerId: $partnerId) {
        id
        username
        partner {
          id
          partnerId
        }
        fullName
        email
        role
        status
        createdAt
      }
    }
  `
);

export const GetPartnerMemberDetailsAPI = makeFetchAction(
  GET_PARTNER_MEMBER_DETAILS_API,
  gql`
    query($id: ID!) {
      get_partner_member(id: $id) {
        id
        username
        partner {
          partnerId
        }
        fullName
        status
        createdAt
        birthDay
        birthMonth
        birthYear
        gender
        email
        role
      }
    }
  `
);
