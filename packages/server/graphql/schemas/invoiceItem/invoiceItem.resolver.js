import { Invoices } from '../../../services';
import { path } from 'lodash/fp';
export default {
  InvoiceItem: {
    invoice: async (payload) => {
      const invoice = await Invoices.findOne({ id: payload.invoice_id });
      return invoice;
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  }
};
