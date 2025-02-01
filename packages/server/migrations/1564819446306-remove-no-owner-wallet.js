import '../_env';
import mongoose from 'mongoose';

import { EWallets, Partners, Users } from '../services';
import { WALLET_PARTNER } from '../graphql/enums/walletType';

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

module.exports.up = async function() {
  const db = await connectDb();
  try {
    const ewallets = await EWallets.find({}, { owner_id: 1, id: 1, type: 1 });

    await Promise.all(
      ewallets.map(async ewallet => {
        const owner =
          ewallet.type === WALLET_PARTNER
            ? await Partners.findOne({ id: ewallet.owner_id })
            : await Users.findOne({ id: ewallet.owner_id });

        if (!owner) {
          return ewallet.remove();
        }
      })
    );

    db.disconnect();
  } catch (e) {
    console.log('e', e);
    db.disconnect();
  }
};

module.exports.down = function(next) {
  next();
};
