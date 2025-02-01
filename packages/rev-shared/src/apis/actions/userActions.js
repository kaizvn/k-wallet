import { respondToSuccess } from '../libs';
import {
  CheckTokenResetPasswordAPI,
  GetReceivedUserDetailsAPI,
  VerifyPasswordAPI,
  InitSecretKey2FAAPI,
  VerifyAuthCode2FAAPI,
  GetStateEnable2FAAPI,
  SetStateEnable2FAAPI
} from '../apiCollections/userAPI';
import Router from 'next/router';

export const checkTokenResetPassword = (token, callback) => {
  return respondToSuccess(
    CheckTokenResetPasswordAPI.actionCreator({
      token
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error('Err: ', resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};

export const getReceivedUserDetails = (username, callback) =>
  respondToSuccess(
    GetReceivedUserDetailsAPI.actionCreator({ username }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );

export const verifyPassword = (password, callback) => {
  return respondToSuccess(
    VerifyPasswordAPI.actionCreator({ password }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.log('Err: ', resp.errors);
        return;
      }
      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};

export const initSecretKey2FA = () =>
  respondToSuccess(InitSecretKey2FAAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
    return;
  });

export const verifyAuthCode2FA = (authCode, callback) =>
  respondToSuccess(
    VerifyAuthCode2FAAPI.actionCreator({ authCode }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );

export const getStateEnable2FA = () =>
  respondToSuccess(GetStateEnable2FAAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }
    return;
  });

export const setStateEnable2FA = isEnable =>
  respondToSuccess(SetStateEnable2FAAPI.actionCreator({ isEnable }), resp => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    Router.push('/user/profile');

    return;
  });
