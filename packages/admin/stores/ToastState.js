import {
  getToastFunction,
  doSuccessNotify,
  doErrorNotify
} from '@revtech/rev-shared/utils';
import { get } from 'lodash/fp';
import { ACTIONS } from 'redux-api-call';
import {
  UPDATE_ACCOUNT_SETTING_API,
  EDIT_USER_INFO_API,
  CANCEL_MEMBER_INVITATION,
  VERIFY_PASSWORD_API,
  APPROVE_PENDING_TRANSACTION_API,
  REJECT_PENDING_TRANSACTION_API,
  MANUAL_TRANSACTION_API
} from '@revtech/rev-shared/apis/names';
import { CREATE_WITHDRAW_ORDER } from './OrdersState';
import {
  ADMIN_LOGIN_API,
  SEND_INVITE_PARTNER_API,
  UPDATE_PARTNER_STATUS,
  UPDATE_USER_STATUS,
  ADD_NEW_USER,
  CANCEL_PARTNER_INVITATION,
  UPDATE_GENERAL_SETTING,
  ADD_NEW_MODERATOR
} from './AdminState';
import { APPROVE_PENDING_TRANSACTION } from './PartnerState';
import { ADD_NEW_COIN, UPDATE_COIN_STATUS, UPDATE_COIN } from './CoinState';
import { CHANGE_PASSWORD_API } from '@revtech/rev-shared/apis/names';
import {
  SYNC_EWALLET_WITH_NETWORK,
  RE_NEW_DEPOSIT_ADDRESS
} from './WalletState';
const hasErrors = get('json.errors');

export default {
  displayNotify(state = {}, { type, payload = {} }) {
    const { message, name } = payload;
    let msgNotify = '';
    if (type === ACTIONS.COMPLETE && !hasErrors(payload)) {
      switch (name) {
        case ADMIN_LOGIN_API:
          msgNotify = 'Login success';
          break;
        case EDIT_USER_INFO_API:
          msgNotify = 'Edit user information success';
          break;
        case ADD_NEW_USER:
          msgNotify = 'Add new user success';
          break;
        case UPDATE_ACCOUNT_SETTING_API:
          msgNotify = 'Update account setting success';
          break;
        case CREATE_WITHDRAW_ORDER:
          msgNotify = 'Create withdraw order success';
          break;
        case CANCEL_PARTNER_INVITATION:
          msgNotify = 'Cancel partner invitation success';
          break;
        case SEND_INVITE_PARTNER_API:
          msgNotify = 'Send invite partner success';
          break;
        case UPDATE_PARTNER_STATUS:
          msgNotify = 'Update partner status success';
          break;
        case CANCEL_MEMBER_INVITATION:
          msgNotify = 'Cancel member invitation success';
          break;
        case UPDATE_USER_STATUS:
          msgNotify = 'Update user status success';
          break;
        case UPDATE_GENERAL_SETTING:
          msgNotify = 'Update general setting success';
          break;
        case APPROVE_PENDING_TRANSACTION:
          msgNotify = 'Approve transaction success';
          break;
        case VERIFY_PASSWORD_API:
          msgNotify = 'Verify password success';
          break;
        case ADD_NEW_MODERATOR:
          msgNotify = 'Add new moderator success';
          break;
        case APPROVE_PENDING_TRANSACTION_API:
          msgNotify = 'Approve pending transaction success';
          break;
        case REJECT_PENDING_TRANSACTION_API:
          msgNotify = 'Reject pending transaction success';
          break;
        case MANUAL_TRANSACTION_API:
          msgNotify = 'Manual transaction success';
          break;
        case ADD_NEW_COIN:
          msgNotify = 'Add new coin success';
          break;
        case UPDATE_COIN_STATUS:
          msgNotify = 'Update coin status success';
          break;
        case UPDATE_COIN:
          msgNotify = 'Update coin success';
          break;
        case CHANGE_PASSWORD_API:
          msgNotify = 'Update password success';
          break;
        case SYNC_EWALLET_WITH_NETWORK:
          msgNotify = 'Sync wallet balance success';
          break;
        case RE_NEW_DEPOSIT_ADDRESS:
          msgNotify = 'Refresh deposit address success';
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
        case ADMIN_LOGIN_API:
          msgNotify = 'Login fail';
          break;
        case EDIT_USER_INFO_API:
          msgNotify = 'Edit user information fail';
          break;
        case ADD_NEW_USER:
          msgNotify = 'Add new user fail';
          break;
        case UPDATE_ACCOUNT_SETTING_API:
          msgNotify = 'Update account setting fail';
          break;
        case CREATE_WITHDRAW_ORDER:
          msgNotify = 'Create withdraw order fail';
          break;
        case CANCEL_PARTNER_INVITATION:
          msgNotify = 'Cancel partner invitation fail';
          break;
        case SEND_INVITE_PARTNER_API:
          msgNotify = 'Send invite partner fail';
          break;
        case UPDATE_PARTNER_STATUS:
          msgNotify = 'Update partner status fail';
          break;
        case CANCEL_MEMBER_INVITATION:
          msgNotify = 'Cancel member invitation fail';
          break;
        case UPDATE_USER_STATUS:
          msgNotify = 'Update user status fail';
          break;
        case UPDATE_GENERAL_SETTING:
          msgNotify = 'Update general setting fail';
          break;
        case APPROVE_PENDING_TRANSACTION:
          msgNotify = 'Approve transaction failed';
          break;
        case VERIFY_PASSWORD_API:
          msgNotify = 'Verify password failed';
          break;
        case ADD_NEW_MODERATOR:
          msgNotify = 'Add new moderator fail';
          break;
        case APPROVE_PENDING_TRANSACTION_API:
          msgNotify = 'Approve pending transaction fail';
          break;
        case REJECT_PENDING_TRANSACTION_API:
          msgNotify = 'Reject pending transaction fail';
          break;
        case MANUAL_TRANSACTION_API:
          msgNotify = 'Manual transaction fail';
          break;
        case ADD_NEW_COIN:
          msgNotify = 'Add new coin fail';
          break;
        case UPDATE_COIN_STATUS:
          msgNotify = 'Update coin status fail';
          break;
        case UPDATE_COIN:
          msgNotify = 'Update coin fail';
          break;
        case CHANGE_PASSWORD_API:
          msgNotify = 'Update password fail';
          break;
        case SYNC_EWALLET_WITH_NETWORK:
          msgNotify = 'Sync wallet balance fail';
          break;
        case RE_NEW_DEPOSIT_ADDRESS:
          msgNotify = 'Refresh deposit address fail';
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
