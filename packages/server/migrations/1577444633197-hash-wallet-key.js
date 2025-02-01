import '../_env';
import mongoose from 'mongoose';
import { WalletKeys, Hasher } from '../services';

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
  const walletKeys = await WalletKeys.find({});

  for (let key of walletKeys) {
    await WalletKeys.updateOne(
      {
        id: key.id
      },
      {
        wallet_key: Hasher.encode(key.wallet_key)
      }
    );
  }

  await db.disconnect();
  next();
};

module.exports.down = async function(next) {
  const db = await connectDb();

  const walletKeys = await WalletKeys.find({});
  for (let key of walletKeys) {
    await WalletKeys.updateOne(
      {
        id: key.id
      },
      {
        wallet_key: key.wallet_key
      }
    );
  }
  await db.disconnect();
  next();
};
