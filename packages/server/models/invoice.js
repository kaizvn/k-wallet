import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';
import { INVOICE_OPEN } from '../graphql/enums/invoiceStatus';

const InvoiceSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: { type: String, default: uuid, required: true },
  invoice_code: { type: String, required: true, unique: true },
  owner_id: { type: String, required: true },
  status: { type: Number, default: INVOICE_OPEN },
  to_id: { type: String, required: true },
  carbon_copy: { type: Array, default: [] },
  total_amount: { type: Number, default: 0.0, required: true },
  note: { type: String },
  due_date: { type: Date },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

InvoiceSchema.pre('save', updateTimeWhenSave);
InvoiceSchema.methods.updateDoc = updateDocBuilder();

const Invoices = model('invoices', InvoiceSchema);
export default Invoices;
