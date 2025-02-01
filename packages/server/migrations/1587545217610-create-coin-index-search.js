import '../_env';
import mongoose from 'mongoose';
import { Coins } from '../services';

const searchCoinFields = ['name', 'symbol'];

const getSearchFieldsObj = searchCoinsFields => {
  let searchFieldsObj = {};
  for (let field of searchCoinsFields) {
    searchFieldsObj = { ...searchFieldsObj, [field]: 'text' };
  }
  return searchFieldsObj;
};

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
  const searchCoinFieldsObj = getSearchFieldsObj(searchCoinFields);
  await Coins.collection.createIndex(searchCoinFieldsObj);
  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();
  await Coins.collection.dropIndexes();
  await db.disconnect();
};
