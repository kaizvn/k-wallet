import { isArray } from 'lodash/fp';

import {
  AdminAccount,
  PartnerOwnerAccount,
  CustomerAccount
} from './__mocks__/userAccounts';
import {
  BTC_COIN_ID,
  ETH_COIN_ID,
  RIPPLE_COIN_ID
} from '../graphql/enums/coinId';
import { Coins, EWallets, SystemUsers, PartnerUsers } from '../services';
import { MockPartner } from './__mocks__/partners';
import { WALLET_USER, WALLET_PARTNER } from '../graphql/enums/walletType';
import createContext from './createContext';
import { findUser, findPartner } from '../utils';

export const withRoles = (accountTypes, func) => async () => {
  if (isArray(accountTypes)) {
    for (let accountType of accountTypes) {
      const ctx = await createContext(accountType);
      await func(ctx);
    }
  } else {
    const ctx = await createContext(accountTypes);
    await func(ctx);
  }
};

export const getFirstCoin = () => Coins.findOne();

export const getFirstEwallet = () => EWallets.findOne();

export const getFirstSysUser = () => findUser(AdminAccount.id, SystemUsers);

export const getFirstPartner = () => findPartner(MockPartner.id);

export const getFirstPartnerUser = () =>
  findUser(PartnerOwnerAccount.id, PartnerUsers);

export const getFirstUser = () => findUser(CustomerAccount.id);

export const insertEwallets = async userOrPartner => {
  const coinIds = [BTC_COIN_ID, ETH_COIN_ID, RIPPLE_COIN_ID];

  for (let coinId of coinIds) {
    const ewallet = new EWallets({
      name: 'tempTestWallet',
      type: userOrPartner.username ? WALLET_USER : WALLET_PARTNER,
      owner_id: userOrPartner.id,
      coin_id: coinId,
      balance: Math.round(Math.random() * 9e18 + 1e18)
    });
    await ewallet.save();
  }
};
