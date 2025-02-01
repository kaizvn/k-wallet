import '../_env';
import mongoose from 'mongoose';
import { Coins } from '../services';

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : { useNewUrlParser: true };

options.useUnifiedTopology = true;

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

module.exports.up = async function () {
  const db = await connectDb();
  await Coins.updateMany(
    {},
    {
      $rename: {
        minimum_value_withdraw_partner: 'minimum_withdrawal',
        percentage_withdraw_partner: 'fee_percentage'
      }
    }
  );

  await db.disconnect();
};

module.exports.down = function (next) {
  next();
};
