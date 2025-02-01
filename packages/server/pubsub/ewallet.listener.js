import { TYPE_TX_DEPOSIT } from '../graphql/enums/transactionType';
import {
  addWalletsTo,
  unsetLatestDepositWalletAddress,
  updateWalletBalance
} from '../services/ewallet';
import { createListenerCallback } from './utils';

const INIT_USER_WALLET = 'Init wallet of User ';
const INIT_PARTNER_WALLET = 'Init wallet of Partner';
const UPDATE_BALANCE = 'Update Balance';

export const initWalletForUser = createListenerCallback(
  INIT_USER_WALLET,
  async (user) => {
    await addWalletsTo(user);
  }
);

export const initWalletForPartner = createListenerCallback(
  INIT_PARTNER_WALLET,
  async (partner) => addWalletsTo(partner)
);

export const updateBalance = createListenerCallback(
  UPDATE_BALANCE,
  updateWalletBalance
);

export const unsetDepositWallet = createListenerCallback(
  'Unset latest Deposit wallet address',
  (transaction) => {
    if (transaction.type === TYPE_TX_DEPOSIT) {
      unsetLatestDepositWalletAddress(transaction);
    }
  }
);
