import '../_env';
import mongoose from 'mongoose';
import { Coins } from '../services';

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : { useNewUrlParser: true };

const connectDb = () => {
  return new Promise((resolve, reject) =>
    mongoose.connect(mongoUrl + '/' + dbName, options, (err) => {
      if (err) {
        reject(err);
      }
      resolve(mongoose);
    })
  );
};

const btc = { fixed_fee: 0.005, percentage: 0, minimum_value: 0.005 };
const anotherCoin = { fixed_fee: 0.0005, percentage: 0, minimum_value: 0.0005 };

module.exports.up = async function () {
  const db = await connectDb();
  await Coins.updateMany({ coin_id: { $ne: 'btc' } }, btc);
  await Coins.update({ coin_id: 'btc' }, anotherCoin);

  await db.disconnect();
};

module.exports.down = async function () {
  const db = await connectDb();
  await Coins.update(
    {},
    [{ $unset: ['fixed_fee', 'percentage', 'minimum_value'] }],
    { multi: true }
  );
  await db.disconnect();
};
