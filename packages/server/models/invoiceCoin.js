import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';

const InvoiceCoinSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  coin_id: { type: String, required: true },
  sub_total: { type: Number, required: true },
  margin_percentage: { type: Number, default: 0.0 },
  total_amount: { type: Number, required: true },
  deposit_address: String,
  invoice_id: { type: String, required: true },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

InvoiceCoinSchema.pre('save', updateTimeWhenSave);
InvoiceCoinSchema.methods.updateDoc = updateDocBuilder();

const InvoiceCoins = model('invoicecoins', InvoiceCoinSchema);
export default InvoiceCoins;
