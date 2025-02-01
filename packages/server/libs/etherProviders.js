import { ethers, getDefaultProvider, Wallet, Contract, utils } from 'ethers';

import { formatTxSkeleton, parseToNumber } from '../utils/erc20Utils';
import EtherscanClient from './etherscan';
import defaultAbi from './erc20-abi';

const {
  ETHERSCAN_API_KEY,
  INFURA_PROJECT_ID,
  ALCHEMY_API_KEY,
  QUORUM_VALUE
} = process.env;
const {
  DEV_ETHERSCAN_API_KEY,
  DEV_INFURA_PROJECT_ID,
  DEV_ALCHEMY_API_KEY
} = process.env;
const DEV_NETWORK = 'rinkeby';
const ETHER_LIVE_URL = process.env.ETHERSCAN_LIVE_URL;
const ETHERSCAN_API_URL = process.env.ETHERSCAN_API_URL;
const GAS_LIMIT = 21000;

class EtherProvider {
  constructor({ network }) {
    this.network = network || DEV_NETWORK;
    this._contracts = [];
    this.mainUrl = ETHERSCAN_API_URL;
    this.liveUrl = ETHER_LIVE_URL;

    let etherscanKey = ETHERSCAN_API_KEY;
    let infuraKey = INFURA_PROJECT_ID;
    let alchemyKey = ALCHEMY_API_KEY;

    if (network !== 'main' && network !== 'homestead') {
      console.log('network dev', network);
      etherscanKey = DEV_ETHERSCAN_API_KEY;
      infuraKey = DEV_INFURA_PROJECT_ID;
      alchemyKey = DEV_ALCHEMY_API_KEY;
    }

    this.mainProvider = getDefaultProvider(this.network, {
      etherscan: etherscanKey,
      infura: infuraKey,
      alchemy: alchemyKey,
      quorum: QUORUM_VALUE
    });

    this.esProvider = new ethers.providers.EtherscanProvider(
      this.network,
      etherscanKey
    );

    console.log('network: ', network);
    console.log('mainProvider:', !!this.mainProvider ? 'on' : 'off');
    console.log('esProvider:', !!this.esProvider ? 'on' : 'off');
    console.log('****');

    this.etherscanClient = new EtherscanClient({
      network: this.network,
      apiKey: ETHERSCAN_API_KEY
    });
  }

  registerContract(coinId, contractAddress, abi = defaultAbi) {
    const contractInstance = new Contract(
      contractAddress,
      abi,
      this.mainProvider
    );

    const liveContractUrl = [this.liveUrl, 'token', contractAddress].join('/');
    const contractInterface = new utils.Interface(abi);

    this._contracts[coinId] = {
      contractAddress,
      contractInstance,
      liveContractUrl,
      contractInterface
    };
  }

  getContract(coinId) {
    return this._contracts[coinId];
  }

  getLiveTxUrl() {
    return this.liveUrl;
  }

  getHashUrl(hash) {
    return `https://${this.network === 'homestead' ? '' : this.network}.${[
      this.liveUrl,
      'tx',
      hash
    ].join('/')}`;
  }

  createNewAddress() {
    //todo: getBlockNumber then store into address collection: support filter
    const newEtherWallet = ethers.Wallet.createRandom();
    const connectedWallet = newEtherWallet.connect(this.mainProvider);
    console.log({ newEtherWallet });
    return {
      address: connectedWallet.address,
      private: connectedWallet.privateKey
    };
  }

  async getTransaction(txHash) {
    return this.mainProvider.getTransaction(txHash);
  }

  async getERC20Transaction(txHash, coinId) {
    const tx = await this.mainProvider.getTransaction(txHash);
    const contractObj = this.getContract(coinId);
    const tokenData = contractObj.contractInterface.parseTransaction(tx);
    return {
      tx: tx,
      contract: contractObj.contractAddress,
      hash: txHash,
      value: parseInt(tokenData.value.toString())
    };
  }

  async getERC20Transactions(address, contract) {
    //todo
    return this.etherscanClient.getERC20Transactions({
      contractAddress: contract.address,
      address
    });
  }

  async getTransactions(address) {
    return this.esProvider.getHistory(address);
  }

  async getGasPrice(isBigNumber) {
    const gasPrice = await this.mainProvider.getGasPrice();
    return isBigNumber ? gasPrice : parseToNumber(gasPrice);
  }

  //for ethereum tx
  async createSkeleton({ toAddress, privateKey, amount, includeFees }) {
    const gasPrice = await this.getGasPrice(true);
    //todo need a function getSecretKeyByAddress()
    if (!privateKey) {
      throw new Error('invalid privatekey');
    }

    const fromWallet = new Wallet(privateKey);

    let value = utils.bigNumberify(amount.toString());
    if (includeFees) {
      value = value.sub(gasPrice.mul(GAS_LIMIT));
    }

    const tx = {
      to: toAddress,
      gasLimit: GAS_LIMIT,
      gasPrice,
      data: '0x',
      chainId: this.mainProvider.getNetwork().chainId,
      value
    };

    const signature = await fromWallet.sign(tx);

    return formatTxSkeleton({ tx: tx, signature });
  }

  async broadcastTokenTx({ signedTxSkeleton = {}, privateKey }) {
    const { gasPrice, to, value } = signedTxSkeleton.erc;
    const walletWithSigner = new Wallet(privateKey, this.mainProvider);

    const tx = {
      to,
      gasLimit: GAS_LIMIT,
      gasPrice,
      data: '0x',
      chainId: this.mainProvider.getNetwork().chainId,
      value
    };

    const newTx = await walletWithSigner.sendTransaction(tx);

    return {
      erc: newTx,
      tx: {
        ...newTx,
        fees: +parseFloat(newTx.gasPrice) * newTx.gasLimit
      }
    };
  }

  async broadcastERC20TokenTx({
    privateKey,
    contractAddress,
    api = defaultAbi,
    signedTxSkeleton = {}
  }) {
    const { to, value } = signedTxSkeleton.erc || {};
    const wallet = new Wallet(privateKey, this.mainProvider);
    const contract = new ethers.Contract(contractAddress, api, wallet);
    const newTx = await contract.transfer(to, value);
    return {
      erc: newTx,
      tx: {
        ...newTx,
        fees: +parseFloat(newTx.gasPrice) * newTx.gasLimit
      }
    };
  }
}

const etherProvider = new EtherProvider({
  network: 'homestead'
});

const etherProviderDev = new EtherProvider({
  network: 'rinkeby'
});

export default (env) => {
  console.log('env', env);
  return env === 'main' || env === 'homestead'
    ? etherProvider
    : etherProviderDev;
};
