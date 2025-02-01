import { CreateDepositAddressAPI } from '../apiCollections/depositAddressAPI';
import { getResetter } from '../libs';

export const CreateDepositAddressAPIResetter = getResetter(
  CreateDepositAddressAPI
);
