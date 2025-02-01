import { createErrorSelector } from '../libs';
import { CreatePartnerNewWalletAPI } from '../apiCollections/walletAPI';

export const createPartnerWalletErrorSelector = createErrorSelector(
  CreatePartnerNewWalletAPI
);
