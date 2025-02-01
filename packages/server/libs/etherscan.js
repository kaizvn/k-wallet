import { merge } from 'lodash/fp';
import axios from 'axios';

// const objToParams = flow(
//   toPairs,
//   map(([key, value]) => `${key}=${encodeURIComponent(value)}`),
//   join(',')
// );

let mergeParams;

const axiosErrorHandler = function (error) {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
};

class EtherscanClient {
  constructor({ apiToken, network }) {
    this.token = apiToken;
    const apiSubdomain = network ? `api-${network}` : 'api';
    this.apiUrl = `https://${apiSubdomain}.etherscan.io`;
    const defaultOptions = {
      module: 'account',
      startblock: 0,
      endblock: 'latest',
      sort: 'asc',
      apikey: this.token
    };

    mergeParams = merge(defaultOptions);
  }

  async doGet(params) {
    const response = await axios({
      method: 'get',
      url: this.apiUrl,
      params
    }).catch(axiosErrorHandler);

    if (response.status === '0') {
      throw new Error(response.result);
    }

    return response.result;
  }

  async doPost(data) {
    const response = await axios({
      method: 'post',
      url: this.apiUrl,
      data
    }).catch(axiosErrorHandler);

    if (response.status === '0') {
      throw new Error(response.result);
    }

    return response.result;
  }

  async getTransactionsByAddress({
    address,
    startblock = 0,
    endblock = 'latest'
  }) {
    const params = mergeParams({
      module: 'account',
      action: 'txlist',
      startblock,
      endblock,
      address
    });

    return this.doGet(params);
  }

  async getERC20Transactions({
    contractAddress,
    address,
    startblock = 0,
    endblock = 'latest'
  }) {
    const params = mergeParams({
      module: 'account',
      action: 'tokentx',
      startblock,
      endblock,
      sort: 'asc',
      contractaddress: contractAddress,
      address
    });

    return this.doGet(params);
  }

  async getERC721Transactions({
    contractAddress,
    address,
    startblock = 0,
    endblock = 'latest'
  }) {
    const params = mergeParams({
      module: 'account',
      action: 'tokennfttx',
      startblock,
      endblock,
      sort: 'asc',
      contractaddress: contractAddress,
      address
    });

    return this.doGet(params);
  }

  async getTransactionByHash({ hash }) {
    const params = mergeParams({
      module: 'proxy',
      action: 'eth_getTransactionByHash',
      txhash: hash
    });

    return this.doGet(params);
  }

  async getERC20TransactionByHash({
    hash,
    contract,
    address,
    startblock = 0,
    endblock = 'latest'
  }) {
    const erc20Txs = await this.getERC20Transactions({
      contract,
      address,
      startblock,
      endblock
    });

    return erc20Txs.find((tx) => tx.hash === hash);
  }
}

export default EtherscanClient;
