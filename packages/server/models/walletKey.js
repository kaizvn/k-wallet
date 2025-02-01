import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateTimeWhenSave } from './utils';
import { Hasher } from '../services';

const WalletKeySchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  wallet_address_id: { type: String, required: true },
  wallet_key: { type: String, required: true },
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

WalletKeySchema.pre('save', updateTimeWhenSave);

WalletKeySchema.pre('save', function(next) {
  if (this && !this.isModified('wallet_key')) return next();

  this.wallet_key = Hasher.encode(this.wallet_key);
  next();
});

WalletKeySchema.post('init', function(doc) {
  try {
    this.wallet_key = Hasher.decode(doc.wallet_key);
  } catch (e) {
    /*console.log(e); */
  }
});

const WalletKeys = model('walletKeys', WalletKeySchema);

export default WalletKeys;
