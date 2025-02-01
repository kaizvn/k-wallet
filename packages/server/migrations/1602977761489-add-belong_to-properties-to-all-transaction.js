import '../_env';
import mongoose from 'mongoose';
import { EWallets, Transactions } from '../services';
import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : { useNewUrlParser: true };

options.useUnifiedTopology = true;
options.dbName = dbName;

const connectDb = () => {
  return new Promise((resolve, reject) =>
    mongoose.connect(mongoUrl + '/', options, (err) => {
      if (err) {
        reject(err);
      }
      resolve(mongoose);
    })
  );
};

module.exports.up = async function () {
  const db = await connectDb();
  const result = await EWallets.find({});
  await Promise.all(
    result.map(async (ewallet) => {
      console.log(
        'ewa',
        ewallet.coin_id,
        ewallet.receiving_address,
        ewallet.id
      );
      return Transactions.updateMany(
        {
          $or: [
            {
              coin_id: ewallet.coin_id,
              destination: ewallet.receiving_address,
              belong_to: { $exists: 0 }
            },
            {
              coin_id: ewallet.coin_id,
              destination: { $exists: 0 },
              belong_to: { $exists: 0 },
              type: TYPE_TX_DEPOSIT,
              to_wallet_owner_id: ewallet.owner_id
            },
            {
              coin_id: ewallet.coin_id,
              destination: { $exists: 0 },
              belong_to: { $exists: 0 },
              type: TYPE_TX_WITHDRAW,
              from_wallet_owner_id: ewallet.owner_id
            }
          ]
        },
        {
          $set: {
            belong_to: ewallet.id
          }
        }
      );
    })
  );

  console.log({ result });

  await db.disconnect();
};

module.exports.down = async function (next) {
  //const db = await connectDb();
  next();
  //  await db.disconnect();
};
