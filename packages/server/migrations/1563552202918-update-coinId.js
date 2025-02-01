import '../_env';
import mongoose from 'mongoose';
import { Bills, Coins, Transactions } from '../services';
import {
  ETH_COIN_ID,
  BTC_COIN_ID,
  HEIAU_COIN_ID,
  RIPPLE_COIN_ID
} from '../graphql/enums/coinId';

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
    symbol: 'ETH',
    id: ETH_COIN_ID
  },
  {
    symbol: 'BTC',
    id: BTC_COIN_ID
  },
  {
    symbol: 'HEIAU',
    id: HEIAU_COIN_ID
  },
  {
    symbol: 'XRP',
    id: RIPPLE_COIN_ID
  }
];

const updateDocsWithNewCoinId = async () => {
  for (let coinData of coinsData) {
    const coins = await Coins.find({ symbol: coinData.symbol });
    for (let coin of coins) {
      await Bills.updateMany(
        { coin_id: coin.id },
        {
          $set: {
            coin_id: coinData.id
          }
        }
      );
      await Transactions.updateMany(
        { coin_id: coin.id },
        {
          $set: {
            coin_id: coinData.id
          }
        }
      );
      coin.id = coinData.id;
      await coin.save();
    }
  }
};

const removeDupplicateCoins = async () => {
  for (let coinData of coinsData) {
    const coins = await Coins.find({ id: coinData.id });
    for (let i = 0; i < coins.length; i++) {
      if (i === 0) {
        continue;
      }
      await coins[i].deleteOne();
    }
  }
};

module.exports.up = async function() {
  const db = await connectDb();

  await updateDocsWithNewCoinId();
  await removeDupplicateCoins();

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await db.disconnect();
};
