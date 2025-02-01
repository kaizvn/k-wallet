import { Coins, Invoices } from '../../../services';
import { path } from 'lodash/fp';
export default {
  InvoiceCoin: {
    coin: async (payload) => {
      const coin = await Coins.findOne({ id: payload.coin_id });
      return coin;
    },
    subTotal: path('sub_total'),
    marginPercentage: path('margin_percentage'),
    totalAmount: path('total_amount'),
    depositAddress: path('deposit_address'),
    invoice: async (payload) => {
      const invoice = await Invoices.findOne({ id: payload.invoice_id });
      return invoice;
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  }
};
