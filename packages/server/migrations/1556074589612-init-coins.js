import '../_env';

import mongoose from 'mongoose';

import {
  BTC_COIN_ID,
  ETH_COIN_ID,
  RIPPLE_COIN_ID,
  DASH_COIN_ID,
  DOGE_COIN_ID,
  LTC_COIN_ID,
  BLOCKCYPHER_COIN_ID
} from '../graphql/enums/coinId';
import { Coins } from '../services';

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : {
      useNewUrlParser: true
    };

const connectDb = () => {
  return new Promise((resolve, reject) =>
    mongoose.connect(mongoUrl + '/' + dbName, options, err => {
      if (err) {
        reject(err);
      }
      resolve(mongoose);
    })
  );
};

const coinsData = [
  {
    id: ETH_COIN_ID,
    name: 'ethereum',
    symbol: 'ETH',
    logo: '/static/coin/eth.png',
    status: 1
  },
  {
    id: BTC_COIN_ID,
    name: 'bitcoin',
    symbol: 'BTC',
    logo: '/static/coin/btc.png',
    status: 0
  },
  {
    id: RIPPLE_COIN_ID,
    name: 'ripple',
    symbol: 'XRP',
    logo: '/static/coin/ripple.png',
    status: 0
  },
  {
    id: DOGE_COIN_ID,
    name: 'dogecoin',
    symbol: 'DOGE',
    logo: '/static/coin/doge.png',
    status: 0
  },
  {
    id: DASH_COIN_ID,
    name: 'dash',
    symbol: 'DASH',
    logo: '/static/coin/dash.png',
    status: 0
  },
  {
    id: LTC_COIN_ID,
    name: 'litecoin',
    symbol: 'LTC',
    logo: '/static/coin/ltc.png',
    status: 0
  },
  {
    id: BLOCKCYPHER_COIN_ID,
    name: 'bitcrystals',
    symbol: 'BCY',
    logo: '/static/coin/bcy.png',
    status: 1
  }
];

module.exports.up = async function() {
  const db = await connectDb();

  for (let coinData of coinsData) {
    await new Coins(coinData).save();
  }

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  for (let coinData of coinsData) {
    await Coins.deleteMany({ id: coinData.id });
  }

  await db.disconnect();
};
