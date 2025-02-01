import { ethers } from 'ethers';

const BC_CONFIRMATION_THRESHOLD =
  parseInt(process.env.BC_CONFIRMATION_THRESHOLD) + 1 || 4;

export const parseToNumber = (bigOrStringNumber) =>
  parseInt(bigOrStringNumber.toString());

export const formatTxSkeleton = ({ tx, signature }) => {
  if (typeof tx === 'string') return { erc: tx };

  const fees = tx.gasPrice.mul(tx.gasLimit);

  const txFormated = {
    erc: tx,
    tx: {
      ...tx,
      fees
    },
    signature: signature
  };
  return txFormated;
};

export const formatTxStructure = (txs) => {
  if (!!txs.length) {
    let result = [];
    for (let tx in txs) {
      result.push(formatTxStructure(tx));
    }
    return result;
  }
  const fees =
    parseFloat(ethers.utils.formatEther(txs.gasPrice)) *
    parseFloat(ethers.utils.formatEther(txs.gasLimit));

  return {
    block_hash: txs.blockHash,
    block_height: txs.blockNumber,
    hash: txs.hash,
    addresses: [txs.to, txs.from],
    total: txs.value,
    fees,
    confirmed: new Date(txs.timestamp),
    received: new Date(txs.timestamp),
    inputs: [
      {
        output_value: txs.value - fees,
        addresses: [txs.from]
      }
    ],
    outputs: [
      {
        output_value: txs.value - fees,
        addresses: [txs.to]
      }
    ]
  };
};

export const getTotalReceived = (listTransaction, address) => {
  let total = 0;
  for (const tx of listTransaction) {
    if (tx.to === address) {
      total += tx.value;
    }
  }
  return total;
};

export const getTotalSent = (listTransaction, address) => {
  let total = 0;
  for (const tx of listTransaction) {
    if (tx.from === address) {
      total += tx.value;
    }
  }
  return total;
};

export const formatTransactionRef = (listTransaction, address) => {
  let result = [];

  if (typeof listTransaction === 'object') {
    listTransaction = [listTransaction];
  }

  for (const tx of listTransaction) {
    result.push({
      tx_hash: tx.hash,
      block_height: tx.blockNumber,
      tx_input_n: tx.from === address ? 0 : -1,
      tx_output_n: tx.to === address ? 0 : -1,
      value: 50420000000000000,
      ref_balance: 2845236193385545395,
      confirmations: BC_CONFIRMATION_THRESHOLD * 2,
      confirmed: new Date(tx.timestamp).toISOString(),
      double_spend: false
    });
  }

  return result;
};
