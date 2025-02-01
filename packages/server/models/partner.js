import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { P_PENDING } from '../graphql/enums/partnerStatus';
import { updateDocBuilder, updateTimeWhenSave } from './utils';

const PartnerSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    require: true
  },
  partner_id: String,
  name: { type: String, require: true },
  description: {
    type: String,
    default: ''
  },
  phone: { type: String },
  address: String,
  email: { type: String, require: true },
  owner_id: { type: String, require: true },
  status: {
    type: Number,
    default: P_PENDING,
    require: true
  },
  setting: {
    timezone: {
      type: String,
      default: 'Europe/London'
    },
    callback_url: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'en'
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    },
    limit_transfer: {
      type: Number
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  created_at: {
    type: Date,
    default: Date.now,
    require: true
  },
  updated_at: {
    type: Date,
    default: Date.now,
    require: true
  }
});

PartnerSchema.pre('save', updateTimeWhenSave);

PartnerSchema.pre('save', function(next) {
  const partner = this;

  if (partner.partner_id) {
    partner.partner_id = partner.partner_id.toLowerCase();
  }

  next();
});

PartnerSchema.methods.updateDoc = updateDocBuilder();

const Partners = model('partners', PartnerSchema);
export default Partners;
