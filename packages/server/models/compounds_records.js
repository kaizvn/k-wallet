import { model, Schema } from 'mongoose';
import uuid from 'uuid';

import { COMPOUND_STATUS_STARTED } from '../graphql/enums/compoundTypes';
import { updateTimeWhenSave } from './utils';

const CompoundRecordSchema = Schema({
  id: { type: String, default: uuid, required: true },
  owner_id: { type: String, required: true },
  coin_id: { type: String, required: true },
  type: { type: Number, required: true },
  amount: { type: Number, required: true },
  interested_value: { type: Number, default: 0 },
  status: { type: Number, default: COMPOUND_STATUS_STARTED },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

CompoundRecordSchema.pre('save', updateTimeWhenSave);

const CompoundRecord = model('compoundrecords', CompoundRecordSchema);
export default CompoundRecord;
