import '../_env';
import mongoose from 'mongoose';
import { EWallets, Partners, Users } from '../services';
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

const coinIds = [ETH_COIN_ID, BTC_COIN_ID, HEIAU_COIN_ID, RIPPLE_COIN_ID];

const removeDuplicateEWallets = async usersOrPartners => {
  for (let userOrPartner of usersOrPartners) {
    for (let coinId of coinIds) {
      const ewallets = await EWallets.find({
        owner_id: userOrPartner.id,
        coin_id: coinId
      });
      for (let i in ewallets) {
        if (+i !== 0) {
          await ewallets[i].deleteOne();
        }
      }
    }
  }
};

module.exports.up = async function() {
  await connectDb();

  const users = await Users.find();
  const partners = await Partners.find();

  await removeDuplicateEWallets(users);
  await removeDuplicateEWallets(partners);
};

module.exports.down = function(next) {
  next();
};
