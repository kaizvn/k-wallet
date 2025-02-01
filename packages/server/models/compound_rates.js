import { model, Schema } from 'mongoose';
import uuid from 'uuid';

import { updateTimeWhenSave } from './utils';

const CompoundRateSchema = Schema({
  id: { type: String, default: uuid, required: true },
  coin_id: { type: String, required: true },
  type: { type: Number, required: true },
  value: { type: Number, required: true },
  set_by: { type: String, required: true },
  created_at: { type: Date, default: Date.now, required: true },
  updated_at: { type: Date, default: Date.now, required: true }
});

CompoundRateSchema.pre('save', updateTimeWhenSave);

const CompoundRates = model('compoundrates', CompoundRateSchema);
export default CompoundRates;
