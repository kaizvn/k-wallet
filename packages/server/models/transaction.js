import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { ETH_COIN_ID } from '../graphql/enums/coinId';
import { PubSub } from '../pubsub';
import {
  TRANSACTION_PENDING,
  TRANSACTION_FINISHED
} from '../graphql/enums/transactionStatus';
import { updateTimeWhenSave } from './utils';
import { TRANSACTION_SUCCESS } from '../pubsub/events';
import { TYPE_TX_TRANSFER } from '../graphql/enums/transactionType';

const TransactionSchema = Schema({
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
  bill_id: { type: String },
  tracking_id: String,
  from_wallet_owner_id: String,
  to_wallet_owner_id: String,
  from_address: String,
  to_address: String,
  belong_to: {
    type: String
    //required : true  <== later, until has migration
  },
  amount: {
    type: Number,
    default: 0,
    required: true
  },
  original_amount: {
    type: Number,
    default: 0
  },
  fee: { type: Number, default: 0 },
  fee_network: { type: Number, default: 0 },
  fixed_fee: { type: Number, default: 0 },
  fee_percentage: { type: Number, default: 0 },
  extra_amount: { type: Number, default: 0 },
  hash: String,
  internal_hash: String,
  block_hash: String,
  description: String,
  type: {
    type: Number,
    default: TYPE_TX_TRANSFER,
    required: true
  },
  status: {
    type: Number,
    default: TRANSACTION_PENDING
  },
  internal_status: {
    type: Number
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
  sender_addresses: {
    type: Array,
    default: []
  },
  received_address: String,
  destination: String,
  updated_by: String
});

TransactionSchema.pre('save', updateTimeWhenSave);

TransactionSchema.pre('save', function (next) {
  if (this.coin_id === ETH_COIN_ID) {
    this.hash = (this.hash || '').toLowerCase();
    this.block_hash = (this.block_hash || '').toLowerCase();
  }
  next();
});

TransactionSchema.pre('save', async function (next) {
  if (this.status === TRANSACTION_FINISHED) {
    PubSub.emit(TRANSACTION_SUCCESS, this);
  }
  next();
});

const Transactions = model('transactions', TransactionSchema);
export default Transactions;
