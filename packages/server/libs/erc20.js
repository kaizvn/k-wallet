import { compact, concat, flow, join, map } from 'lodash/fp';
import axios from 'axios';

import EWallets from '../models/ewallet';
import { TYPE_TX_DEPOSIT } from '../graphql/enums/transactionType';
import { formatTxSkeleton, parseToNumber } from '../utils/erc20Utils';
import { parseBoolean, sleep } from '../utils';
import etherProviders from './etherProviders';

const BC_CONFIRMATION_THRESHOLD =
  parseInt(process.env.BC_CONFIRMATION_THRESHOLD) || 3;
const GAS_LIMIT = 21000; //from network

const HOOK_URL = 'http://localhost:3003/revhooks/erc20';
const generateHookUrl = flow(compact, concat(HOOK_URL), join('/'));

const callHook = async (url, body, timeoutRecall = 10000, count = 0) => {
  const response = await axios.post(url, body);
  if (response.status !== 200 && count <= 5) {
    await sleep(timeoutRecall);
    callHook(url, body, timeoutRecall * 2, count + 1);
  }
};

const formattAddress = (address) => {
  const prefix = address.substr(0, 2);
  if (prefix === '0x') {
    return address;
  }
  return '0x' + address;
};

const addTxListener = ({ address, url, contract, provider }) => {
  console.log(address);
  address = formattAddress(address);

  const filters = contract.filters.Transfer(null, address);
  filters.fromBlock = 0;
  filters.toBlock = 'latest';

  contract.on(filters, async (fromAddress, toAddress, value, event) => {
    if (formattAddress(toAddress).toUpperCase() === address.toUpperCase()) {
      const transaction = await event.getTransaction();
      callHook(url, {
        fromAddress,
        toAddress,
        value: parseToNumber(value),
        hash: transaction.hash,
        event: 'new-erc20-tx'
      });

      provider.on(transaction.hash, async (tx) => {
        if (tx.confirmations > 4) {
          console.log('confirmations', tx.confirmations, transaction.hash);
          provider.removeAllListeners(transaction.hash);

          callHook(url, {
            fromAddress,
            toAddress,
            value: parseToNumber(value),
            hash: transaction.hash,
            event: 'finished-erc20-tx'
          });
        }
      });
    }
  });
};

const groupAndCreateListener = (coinId, contract, provider) =>
  flow(
    map('old_deposit_addresses'),
    map((depositAddresses) => {
      //get all deposit_addresses then add to listener
      const result = Object.keys(depositAddresses).map((trackingId) => {
        const addresses = depositAddresses[trackingId];
        return addresses.map((address) => {
          console.log('register listenner: [', trackingId, ':', address, ']');

          const url = generateHookUrl([
            coinId,
            TYPE_TX_DEPOSIT,
            trackingId,
            'erc20-deposit'
          ]);
          // console.log({ trackingId, address, url });

          return addTxListener({ address, url, contract, provider });
        });
      });

      return result;
    })
  );

let etherProviderLib;

class ERC20 {
  constructor({
    coin,
    contractAddress,
    chain = 'rinkeby',
    isPFSupport = false,
    singleValue = 1e18,
    isEnabled
  }) {
    this.coin = coin;
    this.contractAddress = contractAddress;
    this.contract = {};

    this.status = parseBoolean(isEnabled);
    this.statusPFSupport = parseBoolean(isPFSupport);

    this.singleValue = singleValue;
    this.chain = chain;

    etherProviderLib = etherProviders(chain);
    this.provider = etherProviderLib.mainProvider;

    if (contractAddress) {
      etherProviderLib.registerContract(coin, contractAddress);
      this.contract = etherProviderLib.getContract(coin).contractInstance;

      this.contract
        .decimals()
        .then((decimal) => {
          this.singleValue = Math.pow(10, decimal);
        })
        .catch(console.error);

      this.contract
        .name()
        .then((name) => {
          this.name = name;
        })
        .catch(console.error);

      EWallets.find({
        coin_id: coin,
        $and: [
          { old_deposit_addresses: { $exists: true } },
          { old_deposit_addresses: { $not: { $eq: {} } } }
        ]
      })
        .then(async (res) => {
          const func = groupAndCreateListener(
            coin,
            this.contract,
            this.provider
          );

          const result = await func(res);

          //console.log('this', this.provider);
          return result;
        })
        .catch(console.error);
    }
  }

  updateStatus(isEnabled = false) {
    this.status = isEnabled;
  }

  isEnabled() {
    return this.status;
  }

  isEthereumCurrency() {
    return true;
  }

  isPFSupport() {
    return false;
  }

  getCoinId() {
    return this.coin;
  }

  fromSmallestToLargestUnit(amountInSmallestUnit) {
    return amountInSmallestUnit / this.singleValue;
  }

  fromLargestToSmallestUnit(amountInLargestUnit) {
    return Math.floor(amountInLargestUnit * this.singleValue);
  }

  getHashUrl(hash) {
    return etherProviderLib.getHashUrl(hash);
  }

  getNetWorkInfo() {
    return this.provider.getNetwork();
  }

  async getGlobalFee() {
    const gasPriceObj = await this.provider.getGasPrice();
    return parseToNumber(gasPriceObj.mul(GAS_LIMIT));
  }

  async getAddress(address) {
    const balance = this.addressToken
      ? await this.contract.balanceOf(address)
      : await this.provider.getBalance(address);
    return {
      address,
      balance,
      unconfirmed_balance: 0,
      final_balance: balance
    };
  }

  async getAddressFull(address) {
    return address;
  }

  // to-do: format response to match with blockcypher
  async getBalance(address) {
    const balance = this.contract
      ? await this.contract.balanceOf(address)
      : await this.provider.getBalance(address);
    return {
      address,
      balance,
      final_balance: balance
    };
  }

  async getTxDetails(txHash) {
    let tx = {};
    if (this.addressToken) {
      tx = await etherProviderLib.getTransaction(txHash);
    } else {
      tx = await etherProviderLib.getERC20Transaction(txHash, this.coin);
    }
    return { ...tx, value: parseToNumber(tx.value) };
  }

  createHashUrl(hash) {
    return etherProviderLib.getHashUrl(hash);
  }

  async createAddress() {
    return etherProviderLib.createNewAddress();
  }

  createPaymentForwarding() {
    throw new Error('This coin is not support payment forwarding!');
  }

  async createTxSkeleton({
    privateKey,
    toAddress,
    amount,
    includeFees = false
  }) {
    const signedSkeleton = await etherProviderLib.createSkeleton({
      toAddress,
      privateKey,
      amount,
      includeFees
    });

    return formatTxSkeleton(signedSkeleton);
  }

  async createNewTx({
    fromAddress,
    toAddress,
    amount,
    privateKey,
    includeFees
  }) {
    const txSkeleton = await this.createTxSkeleton({
      fromAddress,
      toAddress,
      amount,
      privateKey,
      includeFees
    });

    return await this.broadcastTx(txSkeleton, privateKey);
  }

  async broadcastTx(signedTxSkeleton, privateKey) {
    if (this.contractAddress) {
      // ERC20
      return await etherProviderLib.broadcastERC20TokenTx({
        privateKey,
        contractAddress: this.contractAddress,
        signedTxSkeleton
      });
    }

    return await etherProviderLib.broadcastTokenTx({
      privateKey,
      signedTxSkeleton
    });
  }

  // async broadcastTx(signedTxSkeleton, privateKey) {
  //   return await etherProviderLib.broadcastTx({
  //     signedTxSkeleton,
  //     privateKey,
  //     contractAddress: this.contractAddress
  //   });
  // }

  async createNewTokenTx({ toAddress, amount, privateKey }) {
    return this.broadcastTokenTx({
      privateKey,
      toAddress,
      amount
    });
  }

  async broadcastTokenTx({ privateKey, toAddress, amount }) {
    return etherProviderLib.broadcastTokenTx({
      contract: this.contract,
      toAddress,
      amount,
      privateKey
    });
  }

  createAddressHook({ address, coinId, trackingId }) {
    if (this.contract) {
      const url = generateHookUrl([
        coinId,
        TYPE_TX_DEPOSIT,
        trackingId,
        'erc20-deposit'
      ]);

      addTxListener({
        address,
        url,
        contract: this.contract,
        provider: this.provider
      });
    }
  }

  createNonePFHook({ coinId, trackingId, inputAddress }) {
    if (this.contract) {
      const url = generateHookUrl([
        coinId,
        TYPE_TX_DEPOSIT,
        trackingId,
        'erc20-deposit'
      ]);

      addTxListener({
        address: inputAddress,
        url,
        contract: this.contract,
        provider: this.provider
      });
    }

    this.provider.on(inputAddress, async (balance) => {
      console.log(balance);
      //todo : get all tx of address : find new tx)
      const txList = await etherProviderLib.getTransactions(inputAddress);
      console.log(txList);
    });
  }

  createHashHook({ hash, coinId, event = 'tx-confirmation', addressType }) {
    const url = generateHookUrl([coinId, addressType, hash, event]);

    this.provider.once(hash, async (receipt) => {
      const body = {
        hash: receipt.transactionHash,
        event,
        confirmations: BC_CONFIRMATION_THRESHOLD,
        url
      };
      await callHook(url, body);
    });
  }
}

export default ERC20;
