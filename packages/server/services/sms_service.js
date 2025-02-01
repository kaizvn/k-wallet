import twilio from 'twilio';

var ACCOUNT_SID = 'ACdd425cda1510b905d4fc975e9724cd20';
var AUTH_TOKEN = '5029538c1aea241d959ef8c0991669d1';

const client = new twilio(ACCOUNT_SID, AUTH_TOKEN);
const FROM_NUMBER = '(346) 230-1496';
export const sendSMS = async ({ body, to, from = FROM_NUMBER }) => {
  try {
    client.messages.create({ body, to, from });
  } catch (error) {
    throw error;
  }
};

export const RegisterTemplate = `Hello username!,

Thank you for registering to RevPayment.
Please submit your KYC to  verify your account at https://submitkyc.dirolabs.com/mcc/phone
In case of any help required, reach out to us at support@revpayment.io
Thanks`;

export const RegisterTemplateJp = `Hello username!-jp,

Thank you for registering to RevPayment-jp.
Please submit your KYC to  verify your account at https://submitkyc.dirolabs.com/mcc/phone
In case of any help required, reach out to us at support@revpayment.io
Thanks-jp`;

export const VerifiedTemplate = `Hello username!,

We are pleased to inform you that Your account is successfully verified. Let's start using crypto payment service.
You can access to your panel by this link https://www.revpayment.io/login
Best regards,
   RevPayment Team`;

const ReplaceParamsSMSContent = (smsContent, user) => {
  try {
    var mapObj = {
      username: user.first_name + ' ' + user.last_name,
      email: user.email,
      phone: user.phone,
      mcc: user.mcc_code
    };
    var re = new RegExp(Object.keys(mapObj).join('|'), 'gi');
    smsContent = smsContent.replace(re, function(matched) {
      return mapObj[matched];
    });
    return smsContent;
  } catch (error) {
    throw error;
  }
};

const getRegisterTemplateByLanguage = language => {
  switch (language) {
    case 'en':
      return RegisterTemplate;
    case 'jp':
      return RegisterTemplateJp;
    default:
      return RegisterTemplate;
  }
};

export const sendRegisterSMS = (user, language) => {
  return sendSMS({
    body: ReplaceParamsSMSContent(
      getRegisterTemplateByLanguage(language),
      user
    ),
    to: user.mcc_code + user.phone
  });
};
