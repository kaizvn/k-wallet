import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateTimeWhenSave } from './utils';

const EwalletSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid
  },
  name: String,
  coin_id: String,
  balance: Number,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  }
});

EwalletSchema.pre('save', updateTimeWhenSave);

const SystemWallets = model('ewallet', EwalletSchema);
export default SystemWallets;
