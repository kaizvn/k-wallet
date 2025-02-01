import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { USER_SETTINGS } from '../graphql/enums/settingTypes';
import { updateDocBuilder, updateTimeWhenSave } from './utils';

const SettingsSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid
  },
  owner_id: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    default: USER_SETTINGS
  },
  timezone: {
    type: String,
    default: 'Europe/London'
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
    default: Date.now,
    required: true
  }
});

SettingsSchema.pre('save', updateTimeWhenSave);
SettingsSchema.methods.updateDoc = updateDocBuilder();

const Settings = model('settings', SettingsSchema);

export default Settings;
