import nodemailer from 'nodemailer';
import axios from 'axios';
import i18n from 'i18n';
import { getTemplate } from '../mail-templates';

const SENDGRIP_API_KEY =
  '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';
const SENDGRIP_URL = 'https://api.sendgrid.com/v3';
const createSgUrl = (url) => SENDGRIP_URL + url;

const SENDGRIP_SMTP = {
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'cuong88pm',
    pass: '051188Ph@m'
  }
};
const headers = {
  Authorization: `Bearer ${SENDGRIP_API_KEY}`
};
export const Transporter = nodemailer.createTransport(SENDGRIP_SMTP);
// generations is dynamic or legacy
// dynamic is all templates
//legacy is only templates of sub account
export const GetAllTemplates = async (generations) => {
  try {
    const templates = await axios.get(
      createSgUrl(`/templates?generations=${generations}`),
      {
        headers: headers
      }
    );
    return templates.data['templates'];
  } catch (error) {
    throw error;
  }
};

export const GetDetailTemplate = async (template_id) => {
  try {
    const template = await axios.get(createSgUrl(`/templates/${template_id}`), {
      headers: headers
    });
    return template.data;
  } catch (error) {
    throw error;
  }
};

const replaceMailContent = (template, mapObj) => {
  const re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
  return template.replace(re, (matched) => mapObj[matched]);
};

export const sendUserRegistrationMail = (
  recipient,
  { name, phone, mcc, language }
) => {
  const mapObj = {
    '{{name}}': name,
    '{{phone}}': phone,
    '{{mcc}}': mcc
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.user_registration.subject'),
    html: replaceMailContent(
      getTemplate(language, 'userRegistrationTemplate'),
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  return Transporter.sendMail(mailObj);
};

export const sendResetPasswordEmail = (
  recipient,
  { tokenLink, email, language }
) => {
  const mapObj = {
    '{{tokenLink}}': tokenLink,
    '{{email}}': email
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.reset_password.subject'),
    html: replaceMailContent(
      getTemplate(language, 'resetPasswordTemplate'),
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  return Transporter.sendMail(mailObj);
};

export const sendOwnerRegistrationMail = (
  recipient,
  { name, phone, mcc, language }
) => {
  const mapObj = {
    '{{name}}': name,
    '{{phone}}': phone,
    '{{mcc}}': mcc
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.owner_registration.subject'),
    html: replaceMailContent(
      getTemplate(language, 'ownerRegistrationTemplate'),
      mapObj
    ),
    from: 'info@revpayment.io'
  };
  return Transporter.sendMail(mailObj);
};

export const sendMemberRegistrationMail = ({
  ownerEmail,
  memberEmail,
  partnerName,
  ownerName,
  memberName,
  language
}) => {
  const mapObj = {
    '{{partnerName}}': partnerName,
    '{{ownerName}}': ownerName,
    '{{memberName}}': memberName
  };

  const mailObj1 = {
    to: ownerEmail,
    subject: i18n.__('services.mail.member_registration.mail1.subject'),
    html: replaceMailContent(
      getTemplate(language, 'memberRegistrationTemplate').toOwner,
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  const mailObj2 = {
    to: memberEmail,
    subject: `${i18n.__('services.mail.member_registration.mail2.subject1')}
     ${partnerName} ${i18n.__(
      'services.mail.member_registration.mail12.subject2'
    )}`,
    html: replaceMailContent(
      getTemplate(language, 'memberRegistrationTemplate').toMember,
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  return Promise.all([
    Transporter.sendMail(mailObj1),
    Transporter.sendMail(mailObj2)
  ]);
};

export const sendDepositSuccessMail = ({
  recipient,
  name,
  coinSymbol,
  language
}) => {
  const mapObj = {
    '{{name}}': name,
    '{{coinSymbol}}': coinSymbol
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.deposit_success.subject'),
    html: replaceMailContent(
      getTemplate(language, 'depositSuccessTemplate'),
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  return Transporter.sendMail(mailObj);
};

export const sendWithdrawSuccessMail = ({
  recipient,
  name,
  coinSymbol,
  language
}) => {
  const mapObj = {
    '{{name}}': name,
    '{{coinSymbol}}': coinSymbol
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.withdraw_success.subject'),
    html: replaceMailContent(
      getTemplate(language, 'withdrawSuccessTemplate'),
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  return Transporter.sendMail(mailObj);
};

export const sendTransferSuccessMail = ({
  senderEmail,
  receiverEmail,
  senderName,
  receiverName,
  amount,
  coinSymbol,
  senderLanguage,
  receiverLanguage
}) => {
  const mapObj = {
    '{{senderName}}': senderName,
    '{{receiverName}}': receiverName,
    '{{amount}}': amount,
    '{{coinSymbol}}': coinSymbol
  };

  const mailObj1 = {
    to: senderEmail,
    subject: i18n.__('services.mail.transfer_success.mail1.subject'),
    html: replaceMailContent(
      getTemplate(senderLanguage, 'transferSuccessTemplate').toSender,
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  const mailObj2 = {
    to: receiverEmail,
    subject: i18n.__('services.mail.transfer_success.mail2.subject'),
    html: replaceMailContent(
      getTemplate(receiverLanguage, 'transferSuccessTemplate').toReceiver,
      mapObj
    ),
    from: 'info@revpayment.io'
  };

  return Promise.all([
    Transporter.sendMail(mailObj1),
    Transporter.sendMail(mailObj2)
  ]);
};

export const sendInvoiceCreatedMail = (
  recipient,
  { invoiceCode, dueDate, recipientName, partnerName, language, cc }
) => {
  const mapObj = {
    '{{invoiceCode}}': invoiceCode,
    '{{dueDate}}': dueDate,
    '{{recipientName}}': recipientName,
    '{{partnerName}}': partnerName
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.invoice_create.subject'),
    html: replaceMailContent(getTemplate(language, 'newInvoiceCreate'), mapObj),
    from: 'info@revpayment.io',
    cc
  };
  return Transporter.sendMail(mailObj);
};

export const sendOverDueInvoiceMail = (
  recipient,
  { invoiceCode, dueDate, recipientName, partnerName, language, cc }
) => {
  const mapObj = {
    '{{invoiceCode}}': invoiceCode,
    '{{dueDate}}': dueDate,
    '{{recipientName}}': recipientName,
    '{{partnerName}}': partnerName
  };

  const mailObj = {
    to: recipient,
    subject: i18n.__('services.mail.invoice_overdue.subject'),
    html: replaceMailContent(getTemplate(language, 'overDueInvoice'), mapObj),
    from: 'info@revpayment.io',
    cc
  };
  return Transporter.sendMail(mailObj);
};
