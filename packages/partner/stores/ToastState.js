import {
  getToastFunction,
  doSuccessNotify,
  doErrorNotify
} from '@revtech/rev-shared/utils';
import { get } from 'lodash/fp';
import { ACTIONS } from 'redux-api-call';
import { CREATE_WITHDRAW_TRANSACTION } from './OrdersState';

import {
  UPDATE_PARTNER_SETTING,
  SEND_INVITE_MEMBER_API,
  UPDATE_MEMBER_STATUS,
  LOGIN_PARTNER_USER_API
} from './PartnerState';

import { RESEND_CALLBACK_API } from './PaymentState';
import {
  SEND_TO_USER_API,
  CHANGE_PASSWORD_API,
  CREATE_PARTNER_NEW_WALLET_API,
  EDIT_USER_INFO_API,
  CANCEL_MEMBER_INVITATION_API,
  CREATE_DEPOSIT_ADDRESS_API,
  REGISTER_MEMBER_USER_API,
  REGISTER_PARTNER_USER_API,
  UPDATE_ACCOUNT_SETTING_API,
  APPROVE_PENDING_TRANSACTION_API,
  REJECT_PENDING_TRANSACTION_API
} from '@revtech/rev-shared/apis/names';
import {
  CREATE_NEW_INVOICE,
  CREATE_NEW_CLIENT,
  UPDATE_CLIENT,
  RE_SEND_INVOICE_EMAIL
} from './InvoiceState';

const hasErrors = get('json.errors');

export default {
  displayNotify(state = {}, { type, payload = {} }) {
    const { message, name } = payload;
    let msgNotify = '';
    if (type === ACTIONS.COMPLETE && !hasErrors(payload)) {
      switch (name) {
        case LOGIN_PARTNER_USER_API:
          msgNotify = 'Login success';
          break;
        case EDIT_USER_INFO_API:
          msgNotify = 'Edit user information success';
          break;
        case CHANGE_PASSWORD_API:
          msgNotify = 'Change password success';
          break;
        case CREATE_PARTNER_NEW_WALLET_API:
          msgNotify = 'Create new wallet for partner success';
          break;
        case REGISTER_PARTNER_USER_API:
          msgNotify = 'Register partner user success';
          break;
        case REGISTER_MEMBER_USER_API:
          msgNotify = 'Register member user success';
          break;
        case CREATE_WITHDRAW_TRANSACTION:
          msgNotify = 'Create withdraw transaction success';
          break;
        case CREATE_DEPOSIT_ADDRESS_API:
          msgNotify = 'Create deposit address success';
          break;
        case UPDATE_PARTNER_SETTING:
          msgNotify = 'Update partner setting success';
          break;
        case SEND_INVITE_MEMBER_API:
          msgNotify = 'Send invite member success';
          break;
        case UPDATE_MEMBER_STATUS:
          msgNotify = 'Update member success';
          break;
        case CANCEL_MEMBER_INVITATION_API:
          msgNotify = 'Cancel member invitation success';
          break;
        case SEND_TO_USER_API:
          msgNotify = 'Send to user success';
          break;
        case UPDATE_ACCOUNT_SETTING_API:
          msgNotify = 'Update account setting success';
          break;
        case RESEND_CALLBACK_API:
          msgNotify = 'Re-send callback success';
          break;
        case APPROVE_PENDING_TRANSACTION_API:
          msgNotify = 'Approve pending transaction success';
          break;
        case REJECT_PENDING_TRANSACTION_API:
          msgNotify = 'Reject pending transaction success';
          break;
        case CREATE_NEW_INVOICE:
          msgNotify = 'Create new invoice success';
          break;
        case CREATE_NEW_CLIENT:
          msgNotify = 'Create new invoice client success';
          break;
        case UPDATE_CLIENT:
          msgNotify = 'Update invoice client success';
          break;
        case RE_SEND_INVOICE_EMAIL:
          msgNotify = 'Re send invoice email success';
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
        case LOGIN_PARTNER_USER_API:
          msgNotify = 'Login fail';
          break;
        case EDIT_USER_INFO_API:
          msgNotify = 'Edit user information fail';
          break;
        case CHANGE_PASSWORD_API:
          msgNotify = 'Change password fail';
          break;
        case CREATE_PARTNER_NEW_WALLET_API:
          msgNotify = 'Create new wallet for partner fail';
          break;
        case REGISTER_PARTNER_USER_API:
          msgNotify = 'Register partner user fail';
          break;
        case REGISTER_MEMBER_USER_API:
          msgNotify = 'Register member user fail';
          break;
        case CREATE_WITHDRAW_TRANSACTION:
          msgNotify = 'Create withdraw transaction fail';
          break;
        case CREATE_DEPOSIT_ADDRESS_API:
          msgNotify = 'Create deposit address fail';
          break;
        case UPDATE_PARTNER_SETTING:
          msgNotify = 'Update partner setting fail';
          break;
        case SEND_INVITE_MEMBER_API:
          msgNotify = 'Send invite member fail';
          break;
        case UPDATE_MEMBER_STATUS:
          msgNotify = 'Update member fail';
          break;
        case CANCEL_MEMBER_INVITATION_API:
          msgNotify = 'Cancel member invitation fail';
          break;
        case SEND_TO_USER_API:
          msgNotify = 'Send to user fail';
          break;
        case UPDATE_ACCOUNT_SETTING_API:
          msgNotify = 'Update account setting fail';
          break;
        case RESEND_CALLBACK_API:
          msgNotify = 'Re-send callback fail';
          break;
        case APPROVE_PENDING_TRANSACTION_API:
          msgNotify = 'Approve pending transaction fail';
          break;
        case REJECT_PENDING_TRANSACTION_API:
          msgNotify = 'Reject pending transaction fail';
          break;
        case CREATE_NEW_INVOICE:
          msgNotify = 'Create new invoice fail';
          break;
        case CREATE_NEW_CLIENT:
          msgNotify = 'Create new invoice client fail';
          break;
        case RE_SEND_INVOICE_EMAIL:
          msgNotify = 'Re send invoice email fail';
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
