import { get } from 'lodash/fp';
import axios from 'axios';
import i18n from 'i18n';

import { P_MEM, P_OWNER, SYS_ADMIN, SYS_MOD } from '../graphql/enums/userRoles';
import { PartnerUsers, Partners, Users, WalletKeys, Coins } from './';
import { PubSub } from '../pubsub';
import { WALLET_ADDRESS_CREATED } from '../pubsub/events';
import { WALLET_PARTNER, WALLET_USER } from '../graphql/enums/walletType';
import { findPartner } from '../utils';
import { getCryptoLibByCoinId, getCryptoLibExistsByCoinId } from './cryptoLibs';
import { formatEtherAddress, getReceivedAddresses } from '../utils/bcUtils';
import EWallets from './ewallet';
import SystemUsers from './systemUser';
import WalletAddresses from './walletAddress';
import { ETH_COIN_ID } from '../graphql/enums/coinId';

export const getCurrentUserEwallet = async ({ userId, partnerId, coinId }) => {
  let ewallet = partnerId
    ? await EWallets.findOne({
        owner_id: partnerId,
        coin_id: coinId
      })
    : await EWallets.findOne({
        owner_id: userId,
        coin_id: coinId
      });

  if (!ewallet) {
    ewallet = new EWallets({
      coin_id: coinId
    });

    if (partnerId) {
      ewallet.type = WALLET_PARTNER;
      ewallet.owner_id = partnerId;
    } else {
      ewallet.type = WALLET_USER;
      ewallet.owner_id = userId;
    }

    await ewallet.save();
  }

  return ewallet;
};

export const getCoinById = (coinId) =>
  Coins.findOne({ id: coinId }).then((coin) => coin.symbol.toLowerCase());

export const getUserByType = (payload) => {
  if (!payload) {
    return null;
  }

  switch (payload.role) {
    case P_MEM:
    // falls through
    case P_OWNER:
      return PartnerUsers.findOne({ id: payload.id });
    case SYS_ADMIN:
    // falls through
    case SYS_MOD:
      return SystemUsers.findOne({ id: payload.id });
    default:
      return Users.findOne({ id: payload.id });
  }
};

export const getCurrentPartner = (payload) => {
  return payload && payload.partner_id
    ? Partners.findOne({ id: payload.partner_id })
    : null;
};

export const createNewWallet = async (coinId, trackingId) => {
  const cryptoLib = getCryptoLibByCoinId(coinId);
  const newWalletAddress = await cryptoLib.createAddress();

  const walletAddress = new WalletAddresses({
    address: newWalletAddress.address,
    coin_id: coinId
  });

  await walletAddress.save();

  PubSub.emit(WALLET_ADDRESS_CREATED, {
    coinId,
    trackingId,
    address: newWalletAddress.address,
    privateKey: newWalletAddress.private
  });

  return newWalletAddress.address;
};

export const createNewDepositAddress = async ({
  coinId,
  trackingId,
  currentUser,
  currentPartner
}) => {
  const isEther = isEtherCurrency(coinId);
  let ewallet = await getCurrentUserEwallet({
    userId: currentUser.id,
    partnerId: currentPartner && currentPartner.id,
    coinId
  });

  if (!ewallet.receiving_address) {
    if (isEther && coinId !== ETH_COIN_ID) {
      console.log('eth should not be here');
      const ethWallet = await getCurrentUserEwallet({
        userId: currentUser.id,
        partnerId: currentPartner && currentPartner.id,
        coinId: ETH_COIN_ID
      });

      console.log('ethWallet', ethWallet);

      if (!ethWallet.receiving_address) {
        ethWallet.receiving_address = await createNewWallet(
          ETH_COIN_ID,
          trackingId
        );

        await ethWallet.save();
      }
      //set receiving address to ETH
      ewallet.receiving_address = ethWallet.receiving_address;
    } else {
      ewallet.receiving_address = await createNewWallet(coinId, trackingId);
    }
  }

  if (!ewallet.deposit_addresses[trackingId]) {
    const depositAddress = await generateDepositAddress(
      ewallet.receiving_address,
      coinId,
      trackingId
    );

    ewallet.deposit_addresses[trackingId] = depositAddress;

    ewallet.old_deposit_addresses[trackingId] =
      ewallet.old_deposit_addresses[trackingId] || [];
    ewallet.old_deposit_addresses[trackingId].push(depositAddress);

    ewallet.markModified('deposit_addresses');
    ewallet.markModified('old_deposit_addresses');
  }

  await ewallet.save();

  const address = isEther
    ? formatEtherAddress(ewallet.deposit_addresses[trackingId])
    : ewallet.deposit_addresses[trackingId];

  try {
    return {
      address,
      trackingId,
      coinId
    };
  } catch (e) {
    throw new Error(
      i18n.__('transaction.mutation.error.fail_label.deposit'),
      e
    );
  }
};

export const generateDepositAddress = async (
  destinationAddress,
  coinId,
  trackingId
) => {
  if (!destinationAddress) {
    throw new Error('no destination');
  }

  const cryptoLib = getCryptoLibByCoinId(coinId);

  if (cryptoLib.isPFSupport && cryptoLib.isPFSupport()) {
    const paymentForwardObj = await cryptoLib.createPaymentForwarding(
      destinationAddress,
      coinId,
      trackingId
    );

    if (paymentForwardObj) {
      return paymentForwardObj.input_address;
    }
  } else {
    //todo: have to have strategy for non PF support
    const newWalletAddress = await cryptoLib.createAddress();

    const walletAddress = new WalletAddresses({
      address: newWalletAddress.address,
      coin_id: coinId
    });

    await walletAddress.save();

    PubSub.emit(WALLET_ADDRESS_CREATED, {
      coinId,
      trackingId,
      address: newWalletAddress.address,
      privateKey: newWalletAddress.private
    });

    await cryptoLib.createNonePFHook({
      inputAddress: newWalletAddress.address,
      coinId,
      trackingId
    });

    return newWalletAddress.address;
  }
};

export const transferCoin = async ({
  coinId,
  senderAddress,
  amount,
  smallestUnitAmount,
  recipientAddress,
  options
}) => {
  const cryptoLib = getCryptoLibExistsByCoinId(coinId);

  if (!cryptoLib) {
    throw new Error(
      `${coinId} ${i18n.__('services.base.transfer_coin.not_support_yet')}`
    );
  }

  const senderWallet = await WalletAddresses.findOne({
    address: senderAddress
  });

  const walletKey = await WalletKeys.findOne({
    wallet_address_id: senderWallet.id
  });

  if (!walletKey) {
    throw new Error(
      `${i18n.__(
        'services.base.transfer_coin.cannot_find_primary_key'
      )}: ${senderAddress}`
    );
  }

  return cryptoLib.transferCoin({
    options,
    amount,
    smallestUnitAmount,
    recipientAddress,
    senderWalletAddress: {
      address: senderAddress,
      privateKey: walletKey.wallet_key
    }
  });
};

export const createNewEWallet = async ({ coinId, ownerId, walletType }) => {
  if (!walletType) {
    const partner = await findPartner(ownerId);
    walletType = partner ? WALLET_PARTNER : WALLET_USER;
  }

  const newEwallet = new EWallets({
    coin_id: coinId,
    owner_id: ownerId,
    type: walletType
  });
  await newEwallet.save();

  return newEwallet;
};

export const isEtherCurrency = (coinId) => {
  const cryptoLib = getCryptoLibExistsByCoinId(coinId);
  return cryptoLib.isEthereumCurrency();
};

export const convertToPrimaryUnitForDisplay = ({ coinId, amount = 0 }) => {
  if (!amount || !coinId) {
    return (0).toFixed(4);
  }

  const cryptoLib = getCryptoLibExistsByCoinId(coinId);

  const convertedBalance = cryptoLib.fromSmallestToLargestUnit
    ? cryptoLib.fromSmallestToLargestUnit(amount)
    : amount;

  !convertedBalance && console.log(coinId);
  return +convertedBalance || 0;
};

export const convertToPrimaryUnitForTx = ({ coinId, amount }) => {
  if (!amount || !coinId) {
    return 0;
  }

  const cryptoLib = getCryptoLibExistsByCoinId(coinId);

  return get('fromLargestToSmallestUnit')(cryptoLib)
    ? cryptoLib.fromLargestToSmallestUnit(amount)
    : amount;
};

//todo : send callback must have type : ''  and content : {}
export const sendCallback = async ({
  ownerId,
  txDetail,
  error = false
} = {}) => {
  const partner = await Partners.findOne({ id: ownerId });
  const setting = partner && partner.setting;

  try {
    if (setting && setting.callback_url) {
      return axios.post(setting.callback_url, {
        transaction_id: txDetail.id,
        error
      });
    }
  } catch (error) {
    throw new Error('cannot send callback to', setting.callback_url);
  }
};

export const getWithdrawalLimit = async (coinId) => {
  const cryptoLib = getCryptoLibExistsByCoinId(coinId);
  return cryptoLib.getWithdrawalLimit();
};

export const getNewTransactionsOfAddress = async ({ address, coinId }) => {
  const cryptoLib = getCryptoLibExistsByCoinId(coinId);

  return (
    cryptoLib.getNewTransactionsOfAddress &&
    cryptoLib.getNewTransactionsOfAddress(address)
  );
};

export const getGlobalFee = async (coinId) => {
  const cryptoLibs = getCryptoLibExistsByCoinId(coinId);
  return (await cryptoLibs.getGlobalFee()) || 0;
};

export const getHashUrl = async ({ coinId, hash }) => {
  const cryptoLib = getCryptoLibExistsByCoinId(coinId);
  return hash && cryptoLib.getHashUrl ? cryptoLib.getHashUrl(hash) : '';
};

export const getDepositAddressInfo = async ({ coinId, trackingId, rawTx }) => {
  const receivedAddresses = getReceivedAddresses(rawTx);

  if (!receivedAddresses || !receivedAddresses.length) {
    return null;
  }

  let ewallet = await EWallets.findOne({
    [`deposit_addresses.${trackingId}`]: { $in: receivedAddresses },
    coin_id: coinId
  });

  let depositAddress;

  if (!ewallet) {
    // const existedTxWithAddress = await Transactions.findOne({
    //   hash: { $ne: rawTx.hash },
    //   tracking_id: trackingId,
    //   received_address: { $in: receivedAddresses }
    // });

    ewallet = await EWallets.findOne({
      coin_id: coinId,
      [`old_deposit_addresses.${trackingId}`]: { $exists: true }
    });

    if (!ewallet) {
      return null;
    }

    depositAddress = receivedAddresses.find((address) =>
      ewallet.old_deposit_addresses[trackingId].includes(address)
    );

    if (!depositAddress) {
      return null;
    }
  } else {
    depositAddress = ewallet.deposit_addresses[trackingId];
  }

  const walletAddress = await WalletAddresses.findOne({
    address: depositAddress
  });

  const walletKey = await WalletKeys.findOne({
    wallet_address_id: walletAddress.id
  });

  return {
    depositAddress,
    privateKey: walletKey.wallet_key,
    destination: ewallet.receiving_address,
    ownerId: ewallet.owner_id
  };
};

export const getCoinConfigsOfTxType = async (coinId) => {
  const coinInstance = await Coins.findOne({ id: coinId });
  if (!coinInstance) throw new Error(i18n.__('coin.query.error.not_found'));

  return {
    ...coinInstance.toJSON(),
    percentage: coinInstance['fee_percentage'] || 0,
    minimumValue: coinInstance['minimum_withdrawal'] || 0,
    minimumDeposit: coinInstance['minimum_deposit'] || 0
  };
};

export const getSystemFee = async ({ coinId, amountInSmallestUnit }) => {
  const coin = (await Coins.findOne({ id: coinId })) || {};
  const coinConfigs = await getCoinConfigsOfTxType(coinId);
  const cryptoLib = getCryptoLibExistsByCoinId(coinId);
  const amountInLargestUnit = cryptoLib.fromSmallestToLargestUnit(
    amountInSmallestUnit
  );
  const systemFeeByPercentage = cryptoLib.fromLargestToSmallestUnit(
    (amountInLargestUnit * coinConfigs.percentage) / 100
  );

  const fixedFeeInLargestUnit = cryptoLib.fromLargestToSmallestUnit(
    coin.fee_fixed
  );

  return {
    percentage: coinConfigs.percentage,
    minimumValue: fixedFeeInLargestUnit,
    systemFee: Math.max(systemFeeByPercentage, fixedFeeInLargestUnit)
  };
};

export const deleteAddressHookAndPaymentForward = async ({
  address,
  coinId
}) => {
  const cryptoLib = getCryptoLibByCoinId(coinId);
  // find and delete payment forward
  const listPaymentForword = (await cryptoLib.getForwards()) || [];
  const forwardInstances = listPaymentForword.filter(
    (el) => el.input_address === address
  );

  for (const el of forwardInstances) {
    await cryptoLib.deleteForward(el.id);
  }

  // find and delete hook address
  const listHookAddress = await cryptoLib.getHookList();
  const hookInstances = listHookAddress.filter((el) => el.address === address);

  for (const el of hookInstances) {
    await cryptoLib.deleteHook(el.id);
  }
};
