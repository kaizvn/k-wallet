import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';

const InvoiceItemSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  name: { type: String, required: true },
  description: String,
  quantity: { type: Number, required: true },
  price: { type: Number, default: 0, required: true },
  amount: { type: Number, required: true },
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

InvoiceItemSchema.pre('save', updateTimeWhenSave);
InvoiceItemSchema.methods.updateDoc = updateDocBuilder();

const InvoiceItems = model('invoiceitems', InvoiceItemSchema);
export default InvoiceItems;
