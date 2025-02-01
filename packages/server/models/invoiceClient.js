import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';

const InvoiceClientSchema = Schema({
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
  email: { type: String, required: true },
  owner_id: { type: String, required: true },
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

InvoiceClientSchema.pre('save', updateTimeWhenSave);
InvoiceClientSchema.methods.updateDoc = updateDocBuilder();

const InvoiceClients = model('invoiceclients', InvoiceClientSchema);
export default InvoiceClients;
