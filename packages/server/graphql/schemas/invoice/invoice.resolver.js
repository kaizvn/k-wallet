import { path } from 'lodash/fp';

import {
  INVOICE_OPEN,
  INVOICE_CANCELLED,
  INVOICE_CONFIRMED,
  INVOICE_OVERDUE
} from '../../enums/invoiceStatus';
import {
  InvoiceClients,
  InvoiceCoins,
  InvoiceItems,
  Partners
} from '../../../services';

export default {
  Invoice: {
    owner: async (payload) => {
      const owner = await Partners.findOne({ id: payload.owner_id });
      return owner;
    },
    to: async (payload) => {
      const invoiceClient = await InvoiceClients.findOne({ id: payload.to_id });
      return invoiceClient;
    },
    invoiceCode: path('invoice_code'),
    carbonCopy: path('carbon_copy'),
    totalAmount: path('total_amount'),
    dueDate: path('due_date'),
    invoiceItems: async (payload) => {
      const invoiceItems = await InvoiceItems.find({
        invoice_id: payload.id
      });
      return invoiceItems;
    },
    invoiceCoins: async (payload) => {
      const invoiceCoins = await InvoiceCoins.find({
        invoice_id: payload.id
      });
      return invoiceCoins;
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  },

  InvoiceStatus: {
    OVERDUE: INVOICE_OVERDUE,
    OPEN: INVOICE_OPEN,
    CONFIRMED: INVOICE_CONFIRMED,
    CANCELLED: INVOICE_CANCELLED
  }
};
