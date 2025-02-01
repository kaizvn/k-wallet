import { combineResolvers } from 'graphql-resolvers';
import { PubSub } from '../../../pubsub';
import { EVENT_INVOICE_CREATED } from '../../../pubsub/events';
import {
  InvoiceItems,
  Invoices,
  InvoiceCoins,
  Coins,
  Base,
  Email,
  InvoiceClients
} from '../../../services';

import { P_OWNER } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';

const getNameByOwner = (owner = {}) =>
  owner.name || `${owner.first_name} ${owner.last_name}`;

module.exports = {
  Mutation: {
    create_new_invoice: combineResolvers(
      checkAuthorization(P_OWNER),
      async (
        _,
        { invoiceCode, note, toId, carbonCopy, items, coins, dueDate },
        { currentPartner, currentUser, req }
      ) => {
        const language = req.headers['accept-language'];
        const totalAmount = items.reduce((prevValue, currentValue) => {
          return prevValue + currentValue.price * currentValue.quantity;
        }, 0);
        const newInvoice = new Invoices({
          invoice_code: invoiceCode,
          owner_id: currentPartner.id,
          to_id: toId,
          carbon_copy: carbonCopy,
          total_amount: totalAmount,
          note,
          due_date: dueDate
        });

        await newInvoice.save();
        const trackingId = newInvoice.id;

        const saveMultipleInvoiceItem = items.map((item) => {
          const { name, description, quantity, price } = item || {};
          const amount = price * quantity;
          const newInvoiceItem = new InvoiceItems({
            name,
            description,
            quantity,
            price,
            amount,
            invoice_id: newInvoice.id
          });
          newInvoiceItem.save();
          return true;
        });
        const saveMultipleInvoiceCoin = coins.map(async (coin) => {
          const { coinId, subTotal } = coin || {};
          const coinSystem = await Coins.findOne({ id: coinId });
          if (!!coinSystem) {
            const depositAddress = await Base.createNewDepositAddress({
              currentUser,
              currentPartner,
              coinId,
              trackingId
            });
            const newInvoiceCoin = new InvoiceCoins({
              coin_id: coinId,
              sub_total: subTotal,
              deposit_address: depositAddress.address,
              margin_percentage: coinSystem.margin_percentage || 0,
              total_amount:
                subTotal + subTotal * (coinSystem.margin_percentage || 0),
              invoice_id: newInvoice.id
            });
            newInvoiceCoin.save();
          }
          return true;
        });
        await Promise.all(saveMultipleInvoiceItem, saveMultipleInvoiceCoin);
        PubSub.emit(EVENT_INVOICE_CREATED, newInvoice, language);
        return newInvoice;
      }
    ),
    re_send_invoice_mail: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { invoiceID }, { currentPartner, req }) => {
        const language = req.headers['accept-language'];
        const invoice = (await Invoices.findOne({ id: invoiceID })) || {};

        const client =
          (await InvoiceClients.findOne({ id: invoice.to_id })) || {};
        const data = {
          invoiceCode: invoice.invoice_code,
          dueDate: invoice.due_date,
          recipientName: client.email,
          partnerName: getNameByOwner(currentPartner),
          language,
          cc: invoice.carbon_copy
        };

        if (new Date(invoice.due_date) < new Date()) {
          await Email.sendOverDueInvoiceMail(client.email, data);
        } else {
          await Email.sendInvoiceCreatedMail(client.email, data);
        }

        return invoice;
      }
    )
  }
};
