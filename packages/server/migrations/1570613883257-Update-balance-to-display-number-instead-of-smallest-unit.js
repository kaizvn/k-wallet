import '../_env';
import mongoose from 'mongoose';

import { EWallets } from '../services';
import { getCryptoLibByCoinId } from '../services/cryptoLibs';

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

module.exports.up = async function(next) {
  const db = await connectDb();
  (await EWallets.find()).map(ewallet => {
    if (ewallet.balance && ewallet.balance > 0) {
      ewallet.smallest_unit_balance = ewallet.balance;
      const cryptoLib = getCryptoLibByCoinId(ewallet.coin_id);
      ewallet.balance = cryptoLib.fromSmallestToLargestUnit(ewallet.balance);
    }
    return ewallet;
  });
  db.disconnect();
  next();
};

module.exports.down = function(next) {
  next();
};
