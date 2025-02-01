import userRegistrationTemplate from './new-user-register';
import ownerRegistrationTemplate from './new-partner-owner-register';
import memberRegistrationTemplateToOwner from './new-partner-member-register--to-owner';
import memberRegistrationTemplateToMember from './new-partner-member-register--to-member';
import depositSuccessTemplate from './deposit-success';
import withdrawSuccessTemplate from './withdraw-success';
import transferSuccessTemplateToSender from './transfer-success--to-sender.js';
import transferSuccessTemplateToReceiver from './transfer-success--to-receiver';
import resetPasswordTemplate from './user-reset-password';
import newInvoiceCreate from './new-invoice-create';
import overDueInvoice from './overdue-invoice';

module.exports = {
  userRegistrationTemplate,
  ownerRegistrationTemplate,
  depositSuccessTemplate,
  withdrawSuccessTemplate,
  memberRegistrationTemplate: {
    toMember: memberRegistrationTemplateToMember,
    toOwner: memberRegistrationTemplateToOwner
  },
  transferSuccessTemplate: {
    toSender: transferSuccessTemplateToSender,
    toReceiver: transferSuccessTemplateToReceiver
  },
  resetPasswordTemplate,
  newInvoiceCreate,
  overDueInvoice
};
