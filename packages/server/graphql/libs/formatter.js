import { flow, identity, isString, mapValues, pickBy, trim } from 'lodash/fp';
import brn from 'brn';

export const formatMccCode = (mccCode) =>
  mccCode[0] === '+' ? mccCode : '+' + mccCode;

export const formatPhone = (phone) =>
  phone[0] === '0' ? phone.substr(1) : phone;

const trimString = brn(isString, trim);

const trimObjectValues = mapValues((val) => trimString(val));

// Note: allow '' and 0, if want to omit: do it later
export const formatObject = flow(
  trimObjectValues,
  pickBy((item) => item !== null && item !== undefined)
);

// note: identity mean attribute cannot be  0 , '' , null, undefined
export const formatIdentityObject = flow(trimObjectValues, pickBy(identity));
