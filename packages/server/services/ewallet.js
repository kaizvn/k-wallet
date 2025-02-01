import {
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED
} from '../graphql/enums/transactionStatus';
import {
  TYPE_TX_WITHDRAW,
  TYPE_TX_DEPOSIT
} from '../graphql/enums/transactionType';
import { WALLET_PARTNER, WALLET_USER } from '../graphql/enums/walletType';
import { SYNC_WALLET } from '../graphql/enums/activities';
import { convertToPrimaryUnitForDisplay } from './base';
import { getAvailableCoins, getCryptoLibByCoinId } from './cryptoLibs';
import EWallets from '../models/ewallet';
import Transactions from '../models/transaction';
import Activities from '../models/activities';
import client from '../redis';
import { sleep } from '../utils';
import { syncMultiTx } from './transaction';
import { groupBy } from 'lodash';

export const getInDayWithdrawn = async (id, { fromCache } = {}) => {
  if (fromCache) {
    const inDayWithdrawn =
      (await client.hgetAsync(`ewallet:${id}`, 'inDayWithdrawn')) || 0;
    return +inDayWithdrawn;
  }

  const now = new Date();
  const startOfDay = now.setHours(0, 0, 0, 0);
  const endOfDay = now.setHours(23, 59, 59, 999);
  const eWallet = await EWallets.findOne({ id });
  const result = await Transactions.aggregate([
    {
      $match: {
        coin_id: eWallet.coin_id,
        from_wallet_owner_id: eWallet.owner_id,
        type: TYPE_TX_WITHDRAW,
        created_at: {
          $gte: new Date(startOfDay),
          $lt: new Date(endOfDay)
        }
      }
    },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  if (!result || !result.length) {
    return 0;
  }

  const convertedAmount = convertToPrimaryUnitForDisplay({
    amount: result[0].total,
    coinId: eWallet.coin_id
  });

  return convertedAmount || 0;
};

export const updateInDayWithdrawn = (id, amount) =>
  client
    .hincrbyAsync(`ewallet:${id}`, 'inDayWithdrawn', amount)
    .then(async (status) => {
      const todayEnd = new Date().setHours(23, 59, 59, 999);
      await client.expireatAsync(`ewallet:${id}`, parseInt(todayEnd / 1000));
      return status;
    });

export const subtractBalance = (id, amount, { session } = {}) =>
  EWallets.updateOne(
    { id },
    {
      $inc: {
        balance: -amount
      }
    },
    { session }
  );

export const addWalletsTo = async (userOrPartner) => {
  const coinIds = getAvailableCoins();

  for (let coinId of coinIds) {
    const ewallet = await EWallets.findOne({
      owner_id: userOrPartner.id,
      coin_id: coinId
    });

    if (!ewallet) {
      const ewallet = new EWallets({
        type: userOrPartner.username ? WALLET_USER : WALLET_PARTNER,
        owner_id: userOrPartner.id,
        coin_id: coinId,
        balance: 0
      });
      await ewallet.save();
    }
  }
};

export const updateWalletBalance = async (tx, session) => {
  let adjustBalanceCond = {};
  let query = {};
  if (tx.type === TYPE_TX_DEPOSIT) {
    query = {
      coin_id: tx.coin_id,
      owner_id: tx.to_wallet_owner_id
    };

    if (tx.status === TRANSACTION_PENDING) {
      adjustBalanceCond = {
        pending_balance: tx.amount
      };
    } else if (tx.status === TRANSACTION_FINISHED) {
      adjustBalanceCond = {
        pending_balance: 0 - tx.amount,
        balance: tx.amount,
        extra_amount: tx.extra_amount
      };
    }
  } else if (tx.type === TYPE_TX_WITHDRAW) {
    query = {
      coin_id: tx.coin_id,
      owner_id: tx.from_wallet_owner_id
    };

    if (tx.status === TRANSACTION_FINISHED) {
      adjustBalanceCond = {
        locked_balance: 0 - (tx.amount + tx.fee),
        extra_amount: tx.extra_amount
      };
    } else if (tx.status === TRANSACTION_REJECTED) {
      adjustBalanceCond = {
        locked_balance: 0 - (tx.amount + tx.fee),
        balance: tx.amount + tx.fee
      };
    }
  }

  return EWallets.updateOne(query, { $inc: adjustBalanceCond }, { session });
};

export const unsetLatestDepositWalletAddress = async (tx) =>
  EWallets.updateOne(
    {
      coin_id: tx.coin_id,
      owner_id: { $in: [tx.to_wallet_owner_id, tx.from_wallet_owner_id] }
    },
    {
      $unset: {
        [`deposit_addresses.${tx.tracking_id}`]: ''
      }
    }
  );

const syncBalanceOfEwallet = async (
  dataOnNetwork,
  locked_balance,
  currentUser
) => {
  const { balance, unconfirmed_balance, address } = dataOnNetwork;
  const oldValue = await EWallets.findOne({ receiving_address: address });

  const dataBalance = {
    balance: balance - locked_balance,
    pending_balance: unconfirmed_balance,
    is_synchronizing: false
  };
  await EWallets.updateOne({ receiving_address: address }, dataBalance);

  const newValue = await EWallets.findOne({ receiving_address: address });
  const activity = new Activities({
    action: SYNC_WALLET,
    data: {
      old_value: oldValue,
      new_value: newValue
    },
    created_by: currentUser.id
  });
  await activity.save();

  return;
};

export const syncEwalletWithNetwork = async (
  arrEwallet,
  options,
  currentUser
) => {
  let arrayEwalletId = [];
  for (let elEwallet of arrEwallet) {
    const {
      id,
      coin_id,
      locked_balance,
      receiving_address,
      latest_block_height
    } = elEwallet;
    arrayEwalletId.push(id);
    await EWallets.updateOne({ id }, { is_synchronizing: true });
    const coinLib = getCryptoLibByCoinId(coin_id);

    await sleep(1000);
    const addressDataOnNetwork = await coinLib.getAddress(receiving_address, {
      after: options.after || latest_block_height || '',
      before: options.before || '',
      limit: options.limit || ''
    });
    await syncBalanceOfEwallet(
      addressDataOnNetwork,
      locked_balance,
      currentUser
    );

    const arrayTx = groupBy(addressDataOnNetwork.txrefs, 'tx_hash');
    const blockHeight = await syncMultiTx(arrayTx, coin_id, currentUser);
    if (blockHeight > latest_block_height)
      await EWallets.updateOne(
        { receiving_address },
        { latest_block_height: blockHeight }
      );
  }
  return await EWallets.find({ id: { $in: arrayEwalletId } });
};

export default EWallets;
