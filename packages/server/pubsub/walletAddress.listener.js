import { WalletAddresses, WalletKeys } from '../services';
import { addNewWalletAddress } from '../services/walletAddress';
import { createListenerCallback } from './utils';

const SAVE_WALLET_CREDENTIALS = 'Save Wallet Credentials';

const CRATE_NEW_WALLET_ADDRESS = 'Create New Wallet Address';

export const saveWalletCredentials = createListenerCallback(
  SAVE_WALLET_CREDENTIALS,
  async credentials => {
    await addNewWalletAddress(credentials);
  }
);

export const createNewWalletAddress = createListenerCallback(
  CRATE_NEW_WALLET_ADDRESS,
  async ({ address, privateKey }) => {
    const walletAddress = await WalletAddresses.findOne({
      address
    });

    const walletKey = new WalletKeys({
      wallet_address_id: walletAddress.id,
      wallet_key: privateKey
    });

    walletKey.save();
  }
);
