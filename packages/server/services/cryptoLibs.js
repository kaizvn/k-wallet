import { filter, flow, map, toPairs } from 'lodash/fp';
import i18n from 'i18n';

import { BlockCypherAPI, EthereumWallet } from '../libs';
import { COIN_ACTIVE } from '../graphql/enums/coinStatus';
import Coins from '../models/coin';

const CryptoLibs = {};

const CryptoCoin = (coinConfig) => {
  //is ERC20
  if (coinConfig.contract_address) {
    return new EthereumWallet({
      coin: coinConfig.id,
      name: coinConfig.name,
      chain: coinConfig.network,
      isEnabled: coinConfig.status === COIN_ACTIVE,
      singleValue: Math.pow(10, coinConfig.decimals),
      contractAddress: coinConfig.contract_address
    });
  }

  return new BlockCypherAPI({
    coin: coinConfig.id,
    name: coinConfig.name,
    chain: coinConfig.network,
    isEnabled: coinConfig.status === COIN_ACTIVE,
    singleValue: Math.pow(10, coinConfig.decimals),
    isPFSupport: coinConfig.is_pf_support
  });
};

Coins.find({})
  .then((data) =>
    Promise.all(
      data.map(async (coinConfigs) => {
        const coinInstance = CryptoCoin(coinConfigs);

        if (!coinInstance || !coinInstance.getCoinId) {
          return;
        }

        const coinId = coinInstance.getCoinId();

        if (!coinId) {
          return;
        }

        if (CryptoLibs[coinId]) {
          console.error('coin id' + coinId + ' has more than one libs');
          return;
        }

        //    console.log('coinInstance', coinInstance);

        CryptoLibs[coinId] = coinInstance;
      })
    )
  )
  .catch((error) => {
    console.log('binding error');
    throw error;
  });

export const getCryptoLibByCoinId = (coinId, isIgnoredEnabled) => {
  const lib = CryptoLibs[coinId];

  if (!lib || (!isIgnoredEnabled && !lib.isEnabled())) {
    throw new Error(
      `${i18n.__('services.crypto_libs.get_by_coin_id.not_support')}
      ${coinId}
      ${i18n.__('services.crypto_libs.get_by_coin_id.not_avaliable')}`
    );
  }

  return lib;
};

export const getCryptoLibExistsByCoinId = (coinId) =>
  getCryptoLibByCoinId(coinId, true);

export const getAllCryptoLibs = () => CryptoLibs;

export const getAvailableCoins = () =>
  flow(
    toPairs,
    filter((coin) => coin[1] && coin[1].isEnabled && coin[1].isEnabled()),
    map((coin) => coin[0])
  )(CryptoLibs);

export const getAllSupportedCoins = () =>
  flow(
    toPairs,
    filter((coin) => coin[1] && typeof coin[1] === 'object'),
    map((coin) => coin[0])
  );

export default { getCryptoLibByCoinId, getAllCryptoLibs };
