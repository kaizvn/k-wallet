import { makeFetchAction } from 'redux-api-call';
import {
  CHECK_TOKEN_RESET_PASSWORD_API,
  GET_RECEIVED_USER_DETAILS_API,
  VERIFY_PASSWORD_API,
  INIT_SECRET_KEY_2FA_API,
  VERIFY_AUTH_CODE_2FA_API,
  GET_STATE_ENABLE_2FA_API,
  SET_STATE_ENABLE_2FA_API
} from '../names';
import { gql } from '../../libs';

export const CheckTokenResetPasswordAPI = makeFetchAction(
  CHECK_TOKEN_RESET_PASSWORD_API,
  gql`
    query($token: String!) {
      check_token_reset_password(token: $token) {
        email
      }
    }
  `
);

export const GetReceivedUserDetailsAPI = makeFetchAction(
  GET_RECEIVED_USER_DETAILS_API,
  gql`
    query($username: String!) {
      get_received_user(username: $username) {
        id
        username
        fullName
        email
        phone
      }
    }
  `
);

export const VerifyPasswordAPI = makeFetchAction(
  VERIFY_PASSWORD_API,
  gql`
    mutation($password: String!) {
      verify_password(password: $password)
    }
  `
);

export const InitSecretKey2FAAPI = makeFetchAction(
  INIT_SECRET_KEY_2FA_API,
  gql`
    mutation {
      generate_secret_key_2FA
    }
  `
);

export const VerifyAuthCode2FAAPI = makeFetchAction(
  VERIFY_AUTH_CODE_2FA_API,
  gql`
    query($authCode: String!) {
      verify_auth_code_2FA(authCode: $authCode)
    }
  `
);

export const GetStateEnable2FAAPI = makeFetchAction(
  GET_STATE_ENABLE_2FA_API,
  gql`
    query {
      get_state_enable_2FA
    }
  `
);

export const SetStateEnable2FAAPI = makeFetchAction(
  SET_STATE_ENABLE_2FA_API,
  gql`
    mutation($isEnable: Boolean!) {
      set_state_enable_2FA(isEnable: $isEnable) {
        id
        username
        twoFactorEnabled
      }
    }
  `
);
