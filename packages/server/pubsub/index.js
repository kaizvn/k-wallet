import { EventEmitter } from 'events';

import {
  ADMIN_FORGOT_PASSWORD,
  ADMIN_SETTING_UPDATED,
  EVENT_TRANSACTION_CREATED,
  EVENT_TRANSACTION_FINISHED,
  MEMBER_CREATED,
  PARTNER_APPROVED,
  PARTNER_CREATED,
  PARTNER_FORGOT_PASSWORD,
  PARTNER_MEMBER_CREATED,
  PARTNER_USER_APPROVED,
  TRANSACTION_SUCCESS,
  USER_CREATED,
  USER_FORGOT_PASSWORD,
  WALLET_ADDRESS_CREATED,
  WALLET_CREATED,
  EVENT_TRANSACTION_REJECTED,
  EVENT_TRANSACTION_APPROVAL,
  EVENT_INVOICE_CREATED
} from './events';
import { addEventListeners } from './utils';
import { createDiroUser } from './diro.listener';
import {
  createNewWalletAddress,
  saveWalletCredentials
} from './walletAddress.listener';
import {
  initWalletForPartner,
  initWalletForUser,
  unsetDepositWallet,
  updateBalance
} from './ewallet.listener';
import { sendRegisteredSMS } from './sms.listener';
import {
  sendUserRegistrationMail,
  sendPartnerRegistrationMail,
  sendMemberRegistrationMail,
  sendTransactionSuccessMail,
  sendUserResetPasswordEmail,
  sendPartnerResetPasswordEmail,
  sendAdminResetPasswordEmail,
  sendInvoiceCreateMail
} from './email.listener';
import {
  updatePartnerTransferLimit,
  initUserAccountSettings,
  initPartnerSettings
} from './setting.listener';
import { sendTransactionCallback } from './transaction.listener';

export const PubSub = new EventEmitter();
const eventListenerCreator = addEventListeners(PubSub);

export default () => {
  eventListenerCreator({
    [USER_CREATED]: [
      createDiroUser,
      sendUserRegistrationMail,
      initWalletForUser,
      sendRegisteredSMS,
      initUserAccountSettings,
      initPartnerSettings
    ],
    [USER_FORGOT_PASSWORD]: [sendUserResetPasswordEmail],
    [PARTNER_FORGOT_PASSWORD]: [sendPartnerResetPasswordEmail],
    [ADMIN_FORGOT_PASSWORD]: [sendAdminResetPasswordEmail],
    [PARTNER_MEMBER_CREATED]: [initUserAccountSettings],
    [PARTNER_APPROVED]: [initPartnerSettings],
    [PARTNER_USER_APPROVED]: [initUserAccountSettings],
    [WALLET_CREATED]: [saveWalletCredentials],
    [WALLET_ADDRESS_CREATED]: [createNewWalletAddress],
    [ADMIN_SETTING_UPDATED]: [updatePartnerTransferLimit],
    [PARTNER_CREATED]: [initWalletForPartner, sendPartnerRegistrationMail],
    [MEMBER_CREATED]: [sendMemberRegistrationMail],
    [TRANSACTION_SUCCESS]: [sendTransactionSuccessMail],
    [EVENT_TRANSACTION_CREATED]: [updateBalance, sendTransactionCallback],
    [EVENT_TRANSACTION_REJECTED]: [updateBalance, sendTransactionCallback],
    [EVENT_TRANSACTION_FINISHED]: [
      updateBalance,
      unsetDepositWallet,
      sendTransactionCallback
    ],
    [EVENT_TRANSACTION_APPROVAL]: [sendTransactionCallback],
    [EVENT_INVOICE_CREATED]: [sendInvoiceCreateMail]
  });

  console.log('finished registering Event Listeners!');
  return eventListenerCreator;
};
