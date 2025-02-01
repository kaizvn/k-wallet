import '../_env';
import mongoose from 'mongoose';
import { EWallets } from '../services';

const searchFields = ['receiving_address'];

const generateObjectSearch = (listField) => {
  let objectSearch = {};
  for (const field of listField) {
    objectSearch[field] = 1;
  }
  return objectSearch;
};

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

module.exports.up = async function () {
  const db = await connectDb();
  await EWallets.collection.createIndex(generateObjectSearch(searchFields));
  await db.disconnect();
};

module.exports.down = async function () {
  const db = await connectDb();
  await EWallets.collection.dropIndexes(searchFields);
  await db.disconnect();
};
