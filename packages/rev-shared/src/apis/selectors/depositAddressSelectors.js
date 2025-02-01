import { flow, get } from 'lodash/fp';
import { createErrorSelector } from '../libs';
import { CreateDepositAddressAPI } from '../apiCollections/depositAddressAPI';

export const depositAddressSelector = flow(
  CreateDepositAddressAPI.dataSelector,
  get('data.create_deposit_address')
);

export const createDepositAddressErrorSelector = createErrorSelector(
  CreateDepositAddressAPI
);
