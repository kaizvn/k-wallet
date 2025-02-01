import Transactions from '../models/transaction';
import Activities from '../models/activities';
import EWallets from './ewallet';
import {
  TYPE_TX_WITHDRAW,
  TYPE_TX_DEPOSIT
} from '../graphql/enums/transactionType';
import {
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING
} from '../graphql/enums/transactionStatus';
import { SYNC_TRANSACTION } from '../graphql/enums/activities';
import { getCryptoLibByCoinId } from './cryptoLibs';
import { sleep } from '../utils';
import moment from 'moment';

const BC_CONFIRMATION_THRESHOLD =
  parseInt(process.env.BC_CONFIRMATION_THRESHOLD) || 3;

export const updateTxStatus = async (query, status) => {
  const isUpdated = await Transactions.updateOne(query, {
    $set: {
      status
    }
  });

  if (isUpdated) {
    return Transactions.findOne(query);
  }

  return null;
};

const getTypeOfTx = (txOnNetwork, receiving_address) => {
  if (JSON.stringify(txOnNetwork.inputs || {}).includes(receiving_address)) {
    return TYPE_TX_WITHDRAW;
  }
  return TYPE_TX_DEPOSIT;
};

const getAddressWithdraw = (addresses = [], from) =>
  addresses.filter((el) => el !== from)[0];

const getAmountWithdraw = (outputs = [], address) => {
  for (const elOutput of outputs) {
    if (JSON.stringify(elOutput).includes(address)) {
      return elOutput.value;
    }
  }
  return 0;
};

const isNeededSync = async (hash) => {
  const tx = await Transactions.findOne({
    $or: [{ hash }, { internal_hash: hash }]
  });
  return {
    isNeedAdd: !tx,
    isNeedUpdate: !!tx && tx.status !== TRANSACTION_FINISHED
  };
};

const syncOneTx = async (txOnNetwork = {}, isUpdate = false, currentUser) => {
  const ewallet = await EWallets.findOne({
    receiving_address: { $in: txOnNetwork.addresses || [] }
  });

  if (!ewallet) return;

  const type = getTypeOfTx(txOnNetwork, ewallet.receiving_address);
  const txData = {
    amount: txOnNetwork.total,
    type,
    coin_id: ewallet.coin_id,
    created_at: moment(txOnNetwork.received),
    status:
      txOnNetwork.confirmations >= BC_CONFIRMATION_THRESHOLD
        ? TRANSACTION_FINISHED
        : TRANSACTION_PENDING
  };

  if (type === TYPE_TX_DEPOSIT) {
    txData['hash'] = txOnNetwork.inputs[0].prev_hash;
    txData['internal_hash'] = txOnNetwork.hash;
    txData['received_address'] = txOnNetwork.inputs[0].addresses[0];
    txData['destination'] = ewallet.receiving_address;
    txData['to_wallet_owner_id'] = ewallet.owner_id;
    txData['fee'] = txOnNetwork.fees;
  } else {
    txData['hash'] = txOnNetwork.hash;
    txData['to_wallet_owner_id'] = getAddressWithdraw(
      txOnNetwork.addresses,
      ewallet.receiving_address
    );
    txData['from_wallet_owner_id'] = ewallet.owner_id;
    txData['fee'] = txOnNetwork.fees;
    txData['amount'] = getAmountWithdraw(
      txOnNetwork.outputs,
      txData['to_wallet_owner_id']
    );
  }

  txData['belong_to'] = ewallet.id;

  let transaction = {};
  let oldValue, newValue;
  if (isUpdate) {
    oldValue = await Transactions.findOne({ hash: txData.hash });
    await Transactions.updateOne({ hash: txData.hash }, txData);
    newValue = await Transactions.findOne({ hash: txData.hash });
  } else {
    transaction = new Transactions(txData);
    await transaction.save();
  }

  const activity = new Activities({
    action: SYNC_TRANSACTION,
    data: isUpdate
      ? { old_value: oldValue || {}, new_value: newValue || {} }
      : { new_value: transaction },
    created_by: currentUser.id
  });
  await activity.save();
  return;
};

export const syncMultiTx = async (arrTx, coin_id, currentUser) => {
  let arrayTxHash = Object.keys(arrTx);
  let maxBlockHeight = 0;
  const coinLib = getCryptoLibByCoinId(coin_id);

  for (let txHash of arrayTxHash) {
    const { isNeedAdd, isNeedUpdate } = await isNeededSync(txHash);

    if (isNeedAdd || isNeedUpdate) {
      await sleep(1000);
      const txOnNetwork = await coinLib.getTxDetails(txHash);
      await syncOneTx(txOnNetwork, isNeedUpdate, currentUser);
    }
    if (arrTx[txHash][0].block_height > maxBlockHeight)
      maxBlockHeight = arrTx[txHash][0].block_height;
  }

  return maxBlockHeight;
};

export default Transactions;
