import { compact, concat, flow, get, join, merge, toNumber } from 'lodash/fp';
import axios from 'axios';

import { TX_FORWARDS, TX_NO_FORWARDS } from '../types/blockcypherEvents';
import { TYPE_TX_DEPOSIT } from '../graphql/enums/transactionType';
import { parseBoolean } from '../utils';
import { signTx } from '../utils/bcUtils';

const BLOCKCYPHER_TOKEN = process.env.BC_API_TOKEN;
const BC_API_URL = process.env.BLOCKCYPHER_API_URL;
const BC_LIVE_URL = process.env.BLOCKCYPHER_LIVE_URL;
const HOOK_URL = process.env.HOOK_URL;
const API_VERSION = process.env.API_VERSION || 'v1';
//const PF_FEE = parseInt(process.env.PAYMENT_FORWARD_FEE) || 1e4;

const BC_CONFIRMATION_THRESHOLD =
  parseInt(process.env.BC_CONFIRMATION_THRESHOLD) + 1 || 4;

const createHookURL = flow(compact, concat(HOOK_URL), join('/'));

// hooks: [coinId, addressType, trackingId, event];
export const generateHookUrl = (...paths) => createHookURL(paths);

const createMainUrl = flow(concat([BC_API_URL, API_VERSION]), join('/'));

const createLiveUrl = (coin, chain) => {
  const path = chain === 'test3' ? 'btc-testnet' : coin;

  return [BC_LIVE_URL, path].join('/');
};

const createGetQuery = (args = {}) => {
  let attrs = [];
  if (args && typeof args === 'object') {
    Object.keys(args).forEach((el) => {
      attrs.push(`${el}=${args[el]}`);
    });
  }
  return `?${attrs.join('&')}`;
};

const getError = get('response.data');
const getFee = flow(get('tx.fees'), toNumber);

class BlockCypherAPI {
  constructor({
    coin,
    token = BLOCKCYPHER_TOKEN,
    chain = 'test',
    isPFSupport = true,
    singleValue = 1e8,
    isEnabled = false,
    mainUrl,
    liveUrl
  }) {
    if (!token || !coin) {
      console.error(
        `Missing constructor attribute(s) of  coin: ${coin} or  token: ${token}`
      );
    }

    this.coin = coin;
    this.mainUrl = mainUrl || createMainUrl([coin, chain]);
    this.liveUrl = liveUrl || createLiveUrl(coin, chain);
    this.liveTxUrl = this.liveUrl + '/tx/';
    this.token = token;
    this.statusPFSupport = parseBoolean(isPFSupport);
    this.singleValue = singleValue;
    this.status = parseBoolean(isEnabled);
    this.isEther =
      String(coin).toUpperCase() === 'ETH' ||
      String(coin).toUpperCase() === 'BETH';

    this.isBlockcypher = true;
  }

  updateStatus(state = false) {
    this.status = state;
  }

  isEnabled() {
    return this.status;
  }

  isPFSupport() {
    return this.statusPFSupport;
  }

  isEthereumCurrency() {
    return this.isEther;
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

  createUrl(path, opts = {}) {
    if (typeof path === 'string') {
      path = [path];
    }

    if (opts.noToken) {
      return `${this.mainUrl}/${path.join('/')}`;
    }

    return `${this.mainUrl}/${path.join('/')}?token=${this.token}`;
  }

  getHashUrl(hash) {
    return this.liveTxUrl + hash;
  }

  async doPost(path, data) {
    if (typeof path !== 'string') {
      throw new Error('cannot do POST action');
    }
    //await sleep();
    const url = this.createUrl(path);

    return axios
      .post(url, data)
      .then((res) => res.data)
      .catch((e) => {
        if (e.response) {
          const errorData = getError(e);

          console.error('Failed URL:', url);
          console.log('input:', JSON.stringify(data, null, 2));
          console.log('**** error:', errorData);

          throw errorData;
        } else {
          throw new Error('POST to %s is not success', path);
        }
      });
  }

  async doGet(opts = {}, ...args) {
    let options = {};
    if (typeof opts === 'string') {
      options = {
        path: opts,
        noToken: false
      };
    } else {
      options = merge({ noToken: false, path: '' })(opts);
    }

    //    await sleep();
    const fullPaths = options.path.split('/').concat(args);
    const url = this.createUrl(fullPaths, options);

    return axios
      .get(url)
      .then((res) => res.data)
      .catch((e) => {
        if (e.response) {
          const errorData = getError(e);

          console.error('Failed URL:', url);
          console.log('**** error:', errorData);

          throw errorData;
        } else {
          throw new Error('GET to %s is not success', url);
        }
      });
  }

  async doDel(path = '', ...args) {
    if (typeof path !== 'string') {
      throw new Error('cannot do DELETE action');
    }

    const fullPaths = [].concat(path, args);
    const url = this.createUrl(fullPaths);

    return axios
      .delete(url)
      .then((res) => res.data)
      .catch((e) => {
        if (e.response) {
          const errorData = getError(e);

          console.error('Failed URL:', url);
          console.log('**** error:', errorData);

          throw errorData;
        } else {
          throw new Error('POST to %s is not success', path);
        }
      });
  }

  async getNetWorkInfo() {
    return this.doGet();
  }

  //level : low , medium , high
  async getGlobalFee(level = 'low') {
    const networkInfo = await this.getNetWorkInfo();
    if (networkInfo) {
      // config for ethereum
      if (networkInfo[`${level}_gas_price`]) {
        const GAS_LIMIT = 21000; //from network
        const gasPrice = Math.max(networkInfo[`${level}_gas_price`], 2e10); // 2e10 is medium gas price eth
        return GAS_LIMIT * gasPrice;
        //config for btc and others
      } else if (networkInfo[`${level}_fee_per_kb`]) {
        return networkInfo[`${level}_fee_per_kb`];
      }
    }

    return 0;
  }

  async getAddress(address, options = {}) {
    const queries = createGetQuery(options);
    return this.doGet(
      {
        noToken: true,
        path: 'addrs'
      },
      address,
      queries
    );
  }

  async getAddressFull(address) {
    return this.doGet('addrs', address, 'full');
  }

  getBalance(address) {
    return this.doGet('addrs', address, 'balance');
  }

  async createWallet(data) {
    return this.doPost('wallets', data);
  }

  async getWallet(name) {
    return this.doGet('wallets', name);
  }

  async createHDWallet(data) {
    return this.doPost('wallets/hd', {
      data
    });
  }

  async getHDWallet(name) {
    return this.doGet({ path: 'wallets', noToken: true }, 'hd', name);
  }

  async getTxDetails(txHash, noToken = true) {
    try {
      return this.doGet({ path: 'txs', noToken }, txHash);
    } catch (error) {
      if (noToken) {
        console.log('no token may failed, retry with token');
        return this.getTxDetails(txHash, false);
      }

      return null;
    }
  }

  async addAddressToWallet(name, addresses) {
    return this.doPost(`wallets/${name}`, { data: { addresses } });
  }

  createHashUrl(hash) {
    return `${this.liveUrl}/${hash}`;
  }

  async createAddress() {
    return this.doPost('addrs');
  }

  async getForwards() {
    return this.doGet('payments');
  }

  async deleteForward(id) {
    return this.doDel('payments', id);
  }

  async createPaymentForwarding(address, coinId, trackingId) {
    const callbackUrl = generateHookUrl(
      coinId,
      TYPE_TX_DEPOSIT,
      trackingId,
      TX_FORWARDS
    );

    return this.doPost('forwards', {
      destination: address,
      callback_url: callbackUrl,
      confirmations: BC_CONFIRMATION_THRESHOLD,
      enable_confirmations: true
      //mining_fees_satoshis: PF_FEE  // now use blockcypher fee
    });
  }

  async createNonePFHook({ coinId, trackingId, inputAddress }) {
    const callbackUrl = generateHookUrl(
      coinId,
      TYPE_TX_DEPOSIT,
      trackingId,
      TX_NO_FORWARDS
    );
    const hookData = {
      event: 'tx-confirmation',
      address: inputAddress,
      url: callbackUrl,
      confirmations: BC_CONFIRMATION_THRESHOLD
    };

    return this.doPost('hooks', hookData);
  }

  async createTxSkeleton({ fromAddress, toAddress, amount, fees }, retry = 2) {
    console.log(
      'start Create Skeleton',
      { fromAddress, toAddress, amount, fees },
      retry
    );
    let value = amount;

    try {
      if (!fees) {
        fees = await this.getGlobalFee();
        value -= fees;
      }

      if (value < 0) {
        return;
      }

      const newTxData = {
        inputs: [{ addresses: [fromAddress] }],
        outputs: [{ addresses: [toAddress], value }],
        preference: 'low',
        confirmations: BC_CONFIRMATION_THRESHOLD,
        fees: fees
      };

      return await this.doPost('txs/new', newTxData);
    } catch (respWithErr) {
      retry--;
      if (getFee(respWithErr) && retry) {
        console.log('retry...');
        value = amount - respWithErr.tx.fees;

        return this.createTxSkeleton(
          {
            fromAddress,
            toAddress,
            amount: value,
            fees: respWithErr.tx.fees
          },
          retry
        );
      } else {
        throw respWithErr;
      }
    }
  }

  async createNewTx({ fromAddress, toAddress, amount, privateKey, fees }) {
    const txSkeleton = await this.createTxSkeleton({
      fromAddress,
      toAddress,
      amount,
      fees
    });

    if (!txSkeleton || !txSkeleton.tosign) {
      console.error('No signature : ', {
        fromAddress,
        toAddress,
        amount,
        privateKey,
        fees
      });

      return false;
    }

    const signedTxSkeleton = signTx(txSkeleton, privateKey);

    return this.broadcastTx(signedTxSkeleton);
  }

  async broadcastTx(signedTxSkeleton, privateKey) {
    if (privateKey) {
      signedTxSkeleton = signTx(signedTxSkeleton, privateKey);
    }

    return this.doPost('txs/send', signedTxSkeleton);
  }

  /* Hook events :
   * unconfirmed-tx	, new-block, confirmed-tx, tx-confirmation, double-spend-tx, tx-confidence
   * info: https://www.blockcypher.com/dev/bitcoin/#transfer-asset-endpoint
   */

  async getHookList() {
    return this.doGet('hooks');
  }

  async createAddressHook({
    address,
    coinId,
    event = 'tx-confirmation',
    addressType
  }) {
    const url = generateHookUrl(coinId, addressType, address, event);

    const hookData = {
      event,
      address,
      url,
      confirmations: BC_CONFIRMATION_THRESHOLD
    };

    return this.doPost('hooks', hookData);
  }

  async createHashHook({
    address,
    hash,
    coinId,
    event = 'tx-confirmation',
    addressType
  }) {
    const url = generateHookUrl(coinId, addressType, address, event);

    const hookData = {
      event,
      hash,
      url,
      address,
      confirmations: BC_CONFIRMATION_THRESHOLD
    };

    return this.doPost('hooks', hookData);
  }

  async getHook(id) {
    return this.doGet({ path: 'hooks', noToken: true }, id);
  }

  async deleteHook(id) {
    return this.doDel('hooks', id);
  }
}

export default BlockCypherAPI;
