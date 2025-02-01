import { model, Schema, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';

import { SYS_MOD } from '../graphql/enums/userRoles';
import { U_PENDING } from '../graphql/enums/userStatus';

import { updateDocBuilder, updateTimeWhenSave } from './utils';

const SystemUserSchema = Schema({
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
  title: String,
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: Number,
  email: String,
  birth_date: String,
  role: {
    type: Number,
    default: SYS_MOD,
    required: true
  },
  status: {
    type: Number,
    default: U_PENDING,
    required: true
  },
  setting: {
    homepage_title: {
      type: String,
      default: ''
    },
    homepage_description: {
      type: String,
      default: ''
    },
    limit_transfer: {
      type: Number,
      default: 0
    },
    is_server_active: {
      type: Boolean,
      default: true
    },
    maintenance_message: {
      type: String,
      default: ''
    }
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

SystemUserSchema.pre('save', function (next) {
  var user = this;
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

        return next();
      });
    });
  } else {
    return next();
  }
});

SystemUserSchema.pre('save', updateTimeWhenSave);

SystemUserSchema.methods.comparePassword = function (password) {
  try {
    return bcrypt.compare(password, this.password);
  } catch (err) {
    return err;
  }
};

SystemUserSchema.methods.updateDoc = updateDocBuilder();

const SystemUsers = model('systemUsers', SystemUserSchema);
export default SystemUsers;
