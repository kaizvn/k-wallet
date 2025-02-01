import { model, Schema, Types } from 'mongoose';
import uuid from 'uuid';

import { updateDocBuilder, updateTimeWhenSave } from './utils';

const ActivitySchema = Schema({
  _id: {
    type: Schema.ObjectId,
    default: Types.ObjectId
  },
  id: {
    type: String,
    default: uuid,
    required: true
  },
  action: { type: String, required: true },
  data: {
    old_value: Object,
    new_value: Object
  },
  created_by: String,
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

ActivitySchema.pre('save', updateTimeWhenSave);

ActivitySchema.methods.updateDoc = updateDocBuilder();

const Activities = model('activities', ActivitySchema);
export default Activities;
