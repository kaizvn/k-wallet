import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { WALLET_USER } from '../graphql/enums/walletType';
import { updateTimeWhenSave } from './utils';

const EWalletSchema = Schema(
  {
    _id: {
      type: Schema.ObjectId,
      default: Types.ObjectId
    },
    id: { type: String, default: uuid, required: true },
    type: { type: Number, default: WALLET_USER, required: true },
    name: String,
    owner_id: { type: String, required: true },
    coin_id: { type: String, required: true },
    balance: { type: Number, default: 0, required: true },
    locked_balance: { type: Number, default: 0 },
    pending_balance: { type: Number, default: 0, required: true },
    extra_amount: { type: Number, default: 0 },
    deposit_addresses: {
      type: Schema.Types.Mixed,
      required: true,
      default: {}
    },
    latest_deposit_address: String,
    old_deposit_addresses: {
      type: Schema.Types.Mixed,
      required: true,
      default: {}
    },
    receiving_address: String,
    is_synchronizing: Boolean,
    latest_block_height: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true }
  },
  { minimize: false }
);

EWalletSchema.pre('save', updateTimeWhenSave);
EWalletSchema.methods.safeAdd = function (amount) {
  // TODO - implement true safeAdd
  this.balance += parseFloat(amount);
  return this;
};
EWalletSchema.methods.safeSubtract = function (amount) {
  // TODO - implement true safeSubtract
  this.balance -= parseFloat(amount);
  return this;
};

const EWallets = model('ewallets', EWalletSchema);
export default EWallets;
