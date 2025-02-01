import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { BILL_CREATED } from '../graphql/enums/billStatus';
import { BILL_DEPOSIT } from '../graphql/enums/billType';
import { updateDocBuilder, updateTimeWhenSave } from './utils';

const BillSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  address: { type: String, required: true },
  tracking_id: String,
  coin_id: { type: String, required: true },
  transaction_id: { type: String, required: true },
  owner_id: { type: String, required: true },
  message: String,
  fee: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    default: BILL_DEPOSIT,
    required: true
  },
  amount: {
    type: Number,
    default: 0.0,
    required: true
  },
  actual_amount: {
    type: Number,
    default: 0.0
  },
  status: {
    type: Number,
    default: BILL_CREATED,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  expired_at: {
    type: Date
  }
});

BillSchema.pre('save', updateTimeWhenSave);
BillSchema.methods.updateDoc = updateDocBuilder();

const Bills = model('bills', BillSchema);
export default Bills;
