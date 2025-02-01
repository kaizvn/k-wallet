import { makeFetchAction } from 'redux-api-call';

import {
  GET_CURRENT_USER_API,
  GET_QUICK_FILTER_BILLS_API,
  CHANGE_PASSWORD_API,
  RESET_PASSWORD_API,
  FORGOT_PASSWORD_API,
  GET_MY_WALLETS_API,
  GET_ALL_COINS_API,
  EDIT_USER_INFO_API,
  CANCEL_MEMBER_INVITATION_API,
  GET_BILL_DETAILS_API,
  GET_QUICK_FILTER_TRANSACTIONS_API,
  GET_QUICK_FILTER_PENDING_TRANSACTIONS_API,
  REGISTER_PARTNER_USER_API,
  REGISTER_MEMBER_USER_API
} from '../names';
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

export const GetCurrentUserCreator = formatQuery =>
  makeFetchAction(
    GET_CURRENT_USER_API,
    gql`
        query{
            me{
                ${formatQuery}
            }
        }
    `
  );

export const GetQuickFilterBillsCreator = formatQuery =>
  makeFetchAction(
    GET_QUICK_FILTER_BILLS_API,
    gql`
      query($filter: FilterTable!) {
        get_quick_filter_bills(filter: $filter) {
          bills {
            id
            address
            transaction {
              id
            }
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
              ${formatQuery}
            }
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

export const ChangePasswordCreator = nameQuery =>
  makeFetchAction(
    CHANGE_PASSWORD_API,
    gql`
    mutation($currentPassword: String!, $newPassword: String!) {
      ${nameQuery}(
        currentPassword: $currentPassword
        newPassword: $newPassword
      ) {
        username
      }
    }
  `
  );

export const ResetPasswordCreator = nameQuery =>
  makeFetchAction(
    RESET_PASSWORD_API,
    gql`
      mutation($token: String!, $newPassword: String!) {
        ${nameQuery}(token: $token, newPassword: $newPassword) {
          email
        }
      }
    `
  );

export const ForgotPasswordCreator = nameQuery =>
  makeFetchAction(
    FORGOT_PASSWORD_API,
    gql`
      mutation($email: String!) {
        ${nameQuery}(email: $email) {
          email
        }
      }
    `
  );

export const GetMyWalletsCreator = formatQuery =>
  makeFetchAction(
    GET_MY_WALLETS_API,
    gql`
      query {
        get_my_ewallets {
          id
          balance
          name
          coin {
            id
            name
            symbol
            logo
            feePercentage
            feeFixed
            minimumDeposit
          }
          ${formatQuery ? formatQuery : ''}
        }
      }
    `
  );

export const GetAllCoinsCreator = formatQuery =>
  makeFetchAction(
    GET_ALL_COINS_API,
    gql`
    query {
      get_all_coins {
        id
        symbol
        logo
        ${formatQuery ? formatQuery : ''}
      }
    }
  `
  );

export const EditUserInfoCreator = (formatQuery, isUser) =>
  makeFetchAction(
    EDIT_USER_INFO_API,
    gql`
      mutation(
        $title: String
        $firstName: String
        $lastName: String
        $birthDateString: String
        $email: String
        $identity: String
        ${isUser ? `$avatar: String` : ``}        
      ) {
        edit_my_info(
          title: $title
          firstName: $firstName
          lastName: $lastName
          birthDateString: $birthDateString
          email: $email
          identity: $identity
          ${isUser ? `avatar: $avatar` : ``}
        ) {
          ${formatQuery}
        }
      }
    `
  );

export const CancelMemberInvitationCreator = formatQuery =>
  makeFetchAction(
    CANCEL_MEMBER_INVITATION_API,
    gql`
      mutation($id: ID!) {
        cancel_member_invitation(id: $id) {
          ${formatQuery}
          status
        }
      }
    `
  );

export const GetBillDetailsCreator = formatQuery =>
  makeFetchAction(
    GET_BILL_DETAILS_API,
    gql`
      query($id: ID!) {
        get_bill(id: $id) {
          id
          address
          transaction {
            id
          }
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
            ${formatQuery}
          }
        }
      }
    `
  );

export const GetQuickFilterTransactionsCreator = () =>
  makeFetchAction(
    GET_QUICK_FILTER_TRANSACTIONS_API,
    gql`
      query ($filter: FilterTable!){
      get_quick_filter_transactions (filter: $filter){
        transactions  {
            id
            type
            from {
              ${SWITCH_TRANSACTION_FROM_TO_DATA}
            }
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

export const GetQuickFilterPendingTransactionsCreator = () =>
  makeFetchAction(
    GET_QUICK_FILTER_PENDING_TRANSACTIONS_API,
    gql`
      query ($filter: FilterTable!){
        get_quick_filter_pending_transactions (filter: $filter){
        transactions  {
            id
            type
            from {
              ${SWITCH_TRANSACTION_FROM_TO_DATA}
            }
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

export const RegisterPartnerUserCreator = isUser =>
  makeFetchAction(
    REGISTER_PARTNER_USER_API,
    gql`
      mutation(
        $id: ID
        $username: String!
        $password: String!
        $email: String!
        $title: String!
        $firstName: String!
        $lastName: String!
        $identity: String!
        $birthDateString: String!
        $partnerId: ID!
        $partnerName: String!
        $partnerPhone: String
        $partnerEmail: String
        $partnerAddress: String
        $phone: String!
        $mccCode: String!
        ${
          isUser
            ? ` 
        $zipCode: String!
        $address: String!
        $country: String!
        $region: String!
        `
            : ``
        }
      ) {
        register_partner_user(
          id: $id
          username: $username
          password: $password
          email: $email
          title: $title
          firstName: $firstName
          lastName: $lastName
          identity: $identity
          birthDateString: $birthDateString
          partnerId: $partnerId
          partnerName: $partnerName
          partnerPhone: $partnerPhone
          partnerEmail: $partnerEmail
          partnerAddress: $partnerAddress
          phone: $phone
          mccCode: $mccCode
          ${
            isUser
              ? `
          zipCode: $zipCode
          address: $address
          country: $country
          region: $region
          `
              : ``
          }
        ) {
          id
          fullName
        }
      }
    `
  );

export const RegisterPartnerMemberCreator = isPartner =>
  makeFetchAction(
    REGISTER_MEMBER_USER_API,
    gql`
      mutation(
        $id: ID
        $username: String!
        $password: String!
        $email: String!
        $title: String!
        $firstName: String!
        $lastName: String!
        $identity: String!
        $birthDateString: String!
        $phone: String!
        $mccCode: String!
        ${
          isPartner
            ? `$partnerId: ID!`
            : `
        $zipCode: String!
        $address: String!
        $country: String!
        $region: String!
        `
        }
       
      ) {
        register_partner_member(
          id: $id
          username: $username
          password: $password
          email: $email
          title: $title
          firstName: $firstName
          lastName: $lastName
          identity: $identity
          birthDateString: $birthDateString
          phone: $phone
          mccCode: $mccCode
          ${
            isPartner
              ? `partnerId: $partnerId`
              : `
          zipCode: $zipCode
          address: $address
          country: $country
          region: $region
          `
          }
        ) {
          id
          fullName
        }
      }
    `
  );
