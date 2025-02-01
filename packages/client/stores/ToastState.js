import {
  getToastFunction,
  doSuccessNotify,
  doErrorNotify
} from '@revtech/rev-shared/utils';
import { UPDATE_ACCOUNT_SETTING_API } from '@revtech/rev-shared/apis/names';
import { get } from 'lodash/fp';
import { ACTIONS } from 'redux-api-call';
import { LOGIN_NORMAL_USER_API, REGISTER_NORMAL_USER_API } from './UserState';

import { CREATE_WITHDRAW_BILL } from './OrdersState';

import {
  CREATE_DEPOSIT_ADDRESS_API,
  CHANGE_PASSWORD_API,
  EDIT_USER_INFO_API
} from '@revtech/rev-shared/apis/names';
const hasErrors = get('json.errors');

export default {
  displayNotify(state = {}, { type, payload = {} }) {
    const { message, name } = payload;

    let msgNotify = '';
    if (type === ACTIONS.COMPLETE && !hasErrors(payload)) {
      switch (name) {
        case LOGIN_NORMAL_USER_API: {
          const userWith2FA = get('data.login_normal_user', payload.json);

          if (userWith2FA.isLoginBy2FA && !userWith2FA.user) break;
          msgNotify = 'Login success';
          break;
        }

        case EDIT_USER_INFO_API:
          msgNotify = 'Edit user information success';
          break;
        case CHANGE_PASSWORD_API:
          msgNotify = 'Change password success';
          break;
        case REGISTER_NORMAL_USER_API:
          msgNotify = 'Register success';
          break;
        case CREATE_WITHDRAW_BILL:
          msgNotify = 'Create withdraw bill success';
          break;
        case CREATE_DEPOSIT_ADDRESS_API:
          msgNotify = 'Create deposit address success';
          break;
        case UPDATE_ACCOUNT_SETTING_API:
          msgNotify = 'Update account setting success';
          break;
        default:
          break;
      }
      doSuccessNotify({ message: msgNotify });
      return payload;
    } else if (
      type === ACTIONS.FAILURE ||
      (type === ACTIONS.COMPLETE && hasErrors(payload))
    ) {
      switch (name) {
        case LOGIN_NORMAL_USER_API:
          msgNotify = 'Login fail';
          break;
        case EDIT_USER_INFO_API:
          msgNotify = 'Edit user information fail';
          break;
        case CHANGE_PASSWORD_API:
          msgNotify = 'Change password fail';
          break;
        case REGISTER_NORMAL_USER_API:
          msgNotify = 'Register fail';
          break;
        case CREATE_WITHDRAW_BILL:
          msgNotify = 'Create withdraw bill fail';
          break;
        case CREATE_DEPOSIT_ADDRESS_API:
          msgNotify = 'Create deposit address fail';
          break;
        case UPDATE_ACCOUNT_SETTING_API:
          msgNotify = 'Update account setting fail';
          break;
        default:
          break;
      }
      doErrorNotify({ message: msgNotify });
      return payload;
    } else {
      if (!message) {
        return state;
      }
      const doToast = getToastFunction(type);
      if (doToast) {
        doToast(message);
        return payload;
      }
    }
    return state;
  }
};
