import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';

const ConfigSchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid
  },
  owner_id: String,
  webhook_url: String
});

ConfigSchema.pre('save', updateTimeWhenSave);

ConfigSchema.methods.updateDoc = updateDocBuilder();

const Configs = model('configs', ConfigSchema);

export default Configs;
