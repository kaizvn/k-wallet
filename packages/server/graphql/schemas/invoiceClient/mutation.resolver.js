import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import { InvoiceClients } from '../../../services';

import { P_OWNER } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';
import { validateEmail } from '../../../utils';

module.exports = {
  Mutation: {
    create_new_invoice_client: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { name, email }, { currentPartner }) => {
        const isValidEmail = validateEmail(email);

        const isExistedEmail = await InvoiceClients.findOne({
          email,
          owner_id: currentPartner.id
        });
        if (!!isExistedEmail) {
          throw Error(i18n.__('util.email_existed'));
        }
        if (!isValidEmail) {
          throw Error(i18n.__('util.invalid_email'));
        }

        const newInvoiceClient = new InvoiceClients({
          name,
          email,
          owner_id: currentPartner.id
        });
        await newInvoiceClient.save();
        return newInvoiceClient;
      }
    ),
    update_invoice_client: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { id, name, email }, { currentPartner }) => {
        const isValidEmail = validateEmail(email);

        const invoiceClient = await InvoiceClients.findOne({
          id
        });

        if (!invoiceClient) {
          throw new Error('');
        }
        const isExistedEmail = await InvoiceClients.findOne({
          owner_id: currentPartner.id,
          email,
          $and: [
            {
              email: { $nin: [invoiceClient.email] }
            }
          ]
        });

        if (!!isExistedEmail) {
          throw Error(i18n.__('util.email_existed'));
        }
        if (!isValidEmail) {
          throw Error(i18n.__('util.invalid_email'));
        }

        invoiceClient.email = email;
        invoiceClient.name = name;
        await invoiceClient.save();

        return invoiceClient;
      }
    )
  }
};
