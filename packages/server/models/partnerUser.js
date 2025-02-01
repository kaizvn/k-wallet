import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';

import { FEMALE, MALE } from '../graphql/enums/userGender';
import { P_MEM } from '../graphql/enums/userRoles';
import { U_PENDING } from '../graphql/enums/userStatus';
import { formatGender, updateDocBuilder, updateTimeWhenSave } from './utils';

const PartnerUserSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  username: { type: String },
  password: { type: String },
  title: { type: String },
  first_name: { type: String },
  last_name: { type: String },
  gender: { type: Number },
  identity: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  mcc_code: { type: String },
  birth_date: { type: String },
  partner_id: { type: String, required: true },
  role: {
    type: Number,
    default: P_MEM,
    required: true
  },
  status: {
    type: Number,
    default: U_PENDING,
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
  }
});

PartnerUserSchema.pre('save', function(next) {
  const user = this;
  if (this.password && (this.isModified('password') || this.isNew)) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }

        user.password = hash;
        user.updated_at = Date.now();

        if (user.username) {
          user.username = user.username.toLowerCase();
        }

        return next();
      });
    });
  } else {
    return next();
  }
});

PartnerUserSchema.pre('save', updateTimeWhenSave);
PartnerUserSchema.pre('save', function(next) {
  this.gender = this.title === 'Mr' ? MALE : FEMALE;
  next();
});
PartnerUserSchema.methods.comparePassword = function(password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (err) {
    return err;
  }
};

PartnerUserSchema.methods.updateDoc = updateDocBuilder({
  formatData: formatGender
});

const PartnerUsers = model('partnerUsers', PartnerUserSchema);
export default PartnerUsers;
