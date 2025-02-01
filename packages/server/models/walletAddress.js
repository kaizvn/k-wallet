import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateTimeWhenSave } from './utils';

const WalletAddressSchema = Schema({
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
  hooks: { type: Array, default: [] },
  last_transaction_hash: String,
  deposit_transactions: {
    type: Array,
    default: []
  },
  coin_id: { type: String, required: true },
  processed: {
    type: Number,
    default: 0
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
  }
});

WalletAddressSchema.pre('save', updateTimeWhenSave);

const WalletAddresses = model('walletaddresses', WalletAddressSchema);

export default WalletAddresses;
