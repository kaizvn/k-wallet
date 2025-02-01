import { join } from 'lodash/fp';

import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';
import { createListenerCallback } from './utils';
import { findPartner, findUser } from '../utils';
import Coins from '../services/coin';
import * as Email from '../services/mail';
import { InvoiceClients, Partners, PartnerUsers, Settings } from '../services';

const createLink = join('/');

const { ADMIN_SERVER_URL, PARTNER_SERVER_URL, CLIENT_SERVER_URL } = process.env;

const ADMIN_LINK_RESET_PASSWORD = createLink([
  ADMIN_SERVER_URL,
  'resetpassword?token='
]);

const USER_LINK_RESET_PASSWORD = createLink([
  CLIENT_SERVER_URL,
  'user',
  'resetpassword?token='
]);

const PARTNER_LINK_RESET_PASSWORD = createLink([
  PARTNER_SERVER_URL,
  'resetpassword?token='
]);

const SEND_USER_RESET_PASSWORD_EMAIL =
  'Send email to user when they forgot password';
const SEND_PARTNER_RESET_PASSWORD_EMAIL =
  'Send email to partner when they forgot password';
const SEND_ADMIN_RESET_PASSWORD_EMAIL =
  'Send email to admin when they forgot password';
const SEND_USER_REGISTERED_EMAIL = 'Send email to registered user';
const SEND_PARTNER_REGISTERED_EMAIL = 'Send email to registered owner';
const SEND_MEMBER_REGISTERED_EMAIL = 'Send email to registered member';
const SEND_TRANSACTION_SUCCESS_EMAIL = 'Send transaction success email';
const SEND_INVOICE_CREATED_MAIL = 'Send invoice created mail';

const getNameByOwner = (owner = {}) =>
  owner.name || `${owner.first_name} ${owner.last_name}`;

export const sendUserRegistrationMail = createListenerCallback(
  SEND_USER_REGISTERED_EMAIL,
  async (user, language) => {
    const data = {
      name: user.first_name + ' ' + user.last_name,
      phone: user.phone,
      mcc: user.mcc_code,
      language
    };

    await Email.sendUserRegistrationMail(user.email, data);
  }
);

export const sendPartnerRegistrationMail = createListenerCallback(
  SEND_PARTNER_REGISTERED_EMAIL,
  async (partner, language) => {
    const owner = (await PartnerUsers.findOne({ id: partner.owner_id })) || {};

    const data = {
      name: getNameByOwner(owner),
      phone: owner.phone,
      mcc: owner.mcc_code,
      language
    };

    await Email.sendOwnerRegistrationMail(owner.email, data);
  }
);

export const sendMemberRegistrationMail = createListenerCallback(
  SEND_MEMBER_REGISTERED_EMAIL,
  async (partner, member, language) => {
    const owner = (await PartnerUsers.findOne({ id: partner.owner_id })) || {};

    const data = {
      ownerEmail: owner.email,
      memberEmail: member.email,
      partnerName: ((await findPartner({ id: owner.partner_id })) || {}).name,
      ownerName: getNameByOwner(owner),
      memberName: getNameByOwner(member),
      language
    };

    await Email.sendMemberRegistrationMail(data);
  }
);

export const sendTransactionSuccessMail = createListenerCallback(
  SEND_TRANSACTION_SUCCESS_EMAIL,
  async (transaction) => {
    let ownerSetting;
    if (transaction.type === TYPE_TX_DEPOSIT) {
      const owner =
        (await findPartner(transaction.to_wallet_owner_id)) ||
        (await findUser(transaction.to_wallet_owner_id)) ||
        {};
      ownerSetting =
        (await Settings.findOne({ owner_id: owner.owner_id })) || {};

      const coin = (await Coins.findOne({ id: transaction.coin_id })) || {};

      const data = {
        recipient: owner.email,
        name: getNameByOwner(owner),
        coinSymbol: coin.symbol,
        language: ownerSetting.language
      };
      await Email.sendDepositSuccessMail(data);
    } else if (transaction.type === TYPE_TX_WITHDRAW) {
      const owner =
        (await findPartner(transaction.from_wallet_owner_id)) ||
        (await findUser(transaction.from_wallet_owner_id)) ||
        {};

      ownerSetting =
        (await Settings.findOne({ owner_id: owner.owner_id })) || {};
      const coin = (await Coins.findOne({ id: transaction.coin_id })) || {};

      const data = {
        recipient: owner.email,
        name: getNameByOwner(owner),
        coinSymbol: coin.symbol,
        language: ownerSetting.language
      };
      await Email.sendWithdrawSuccessMail(data);
    } else {
      const sender =
        (await findPartner(transaction.from_wallet_owner_id)) ||
        (await findUser(transaction.from_wallet_owner_id));

      const receiver =
        (await findPartner(transaction.to_wallet_owner_id)) ||
        (await findUser(transaction.to_wallet_owner_id));

      if (sender && receiver) {
        ownerSetting =
          (await Settings.findOne({ owner_id: sender.owner_id })) || {};

        const receiverSetting =
          (await Settings.findOne({
            owner_id: receiver.owner_id
          })) || {};

        const coin = (await Coins.findOne({ id: transaction.coin_id })) || {};

        const data = {
          senderEmail: sender.email,
          receiverEmail: receiver.email,
          senderName: getNameByOwner(sender),
          receiverName: getNameByOwner(receiver),
          amount: transaction.amount,
          coinSymbol: coin.symbol,
          senderLanguage: ownerSetting.language,
          receiverLanguage: receiverSetting.language
        };

        await Email.sendTransferSuccessMail(data);
      }
    }
  }
);

export const sendUserResetPasswordEmail = createListenerCallback(
  SEND_USER_RESET_PASSWORD_EMAIL,
  async (token) => {
    const data = {
      email: token.email,
      tokenLink: USER_LINK_RESET_PASSWORD + token.token,
      language: token.language
    };

    await Email.sendResetPasswordEmail(token.email, data);
  }
);

export const sendPartnerResetPasswordEmail = createListenerCallback(
  SEND_PARTNER_RESET_PASSWORD_EMAIL,
  async (token) => {
    const data = {
      email: token.email,
      tokenLink: PARTNER_LINK_RESET_PASSWORD + token.token,
      language: token.language
    };

    await Email.sendResetPasswordEmail(token.email, data);
  }
);

export const sendAdminResetPasswordEmail = createListenerCallback(
  SEND_ADMIN_RESET_PASSWORD_EMAIL,
  async (token) => {
    const data = {
      email: token.email,
      tokenLink: ADMIN_LINK_RESET_PASSWORD + token.token,
      language: token.language
    };

    await Email.sendResetPasswordEmail(token.email, data);
  }
);

export const sendInvoiceCreateMail = createListenerCallback(
  SEND_INVOICE_CREATED_MAIL,
  async (invoice, language) => {
    const owner = (await Partners.findOne({ id: invoice.owner_id })) || {};
    const client = (await InvoiceClients.findOne({ id: invoice.to_id })) || {};
    const data = {
      invoiceCode: invoice.invoice_code,
      dueDate: invoice.due_date,
      recipientName: client.email,
      partnerName: getNameByOwner(owner),
      language,
      cc: invoice.carbon_copy
    };

    await Email.sendInvoiceCreatedMail(client.email, data);
  }
);
