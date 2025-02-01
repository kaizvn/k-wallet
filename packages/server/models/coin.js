import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';
import { COIN_INACTIVE } from '../graphql/enums/coinStatus';

const CoinSchema = Schema({
  _id: { type: Schema.ObjectId, default: Types.ObjectId },
  id: { type: String, default: uuid, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  logo: String,
  status: { type: Number, default: COIN_INACTIVE, required: true },
  minimum_withdrawal: { type: Number, default: 0, required: true },
  minimum_deposit: { type: Number, default: 0, required: true },
  fee_percentage: { type: Number, default: 0, required: true },
  fee_fixed: { type: Number, default: 0, required: true },
  margin_percentage: { type: Number, default: 0, required: true },
  is_compound_support: { type: Boolean, default: false, required: true },
  master_address: { type: String, required: false },
  master_key: { type: String, required: false },
  contract_address: { type: String, required: false },
  decimals: { type: Number, default: 0, required: true },
  network: { type: String, required: true, default: 'test' },
  is_pf_support: { type: Boolean, required: true, default: false },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

CoinSchema.pre('save', updateTimeWhenSave);

CoinSchema.methods.updateDoc = updateDocBuilder();

const Coins = model('coins', CoinSchema);
export default Coins;
