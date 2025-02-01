import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';

import { FEMALE, MALE } from '../graphql/enums/userGender';
import { U_PENDING } from '../graphql/enums/userStatus';
import { formatGender, updateDocBuilder, updateTimeWhenSave } from './utils';

const UserSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  username: { type: String, required: true },
  password: { type: String, required: true },
  title: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: Number,
  identity: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  mcc_code: { type: String, required: true },
  birth_date: { type: String, required: true },
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
  },
  avatar: String,
  two_factor_secret: String,
  two_factor_enabled: Boolean
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function (err, hash) {
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

UserSchema.pre('save', updateTimeWhenSave);
UserSchema.pre('save', function (next) {
  this.gender = this.title === 'Mr' ? MALE : FEMALE;
  next();
});
UserSchema.methods.comparePassword = function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (err) {
    return err;
  }
};

UserSchema.methods.updateDoc = updateDocBuilder({
  formatData: formatGender
});

const Users = model('Users', UserSchema);
export default Users;
