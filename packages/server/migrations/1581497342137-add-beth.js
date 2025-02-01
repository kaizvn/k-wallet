import '../_env';
import mongoose from 'mongoose';

import { BETH_COIN_ID } from '../graphql/enums/coinId';
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
    id: BETH_COIN_ID,
    name: 'Test ethereum',
    symbol: 'BETH',
    logo: '/static/coin/eth.png',
    status: 1
  }
];

module.exports.up = async function(next) {
  const db = await connectDb();

  for (let coinData of coinsData) {
    const existedCoin = await Coins.findOne({ id: coinData.id });
    if (!existedCoin) {
      await new Coins(coinData).save();
    }
  }

  await db.disconnect();
  next();
};

module.exports.down = async function() {
  const db = await connectDb();

  for (let coinData of coinsData) {
    await Coins.deleteMany({ id: coinData.id });
  }

  await db.disconnect();
};
