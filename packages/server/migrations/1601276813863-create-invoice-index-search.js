import '../_env';
import mongoose from 'mongoose';
import { Invoices } from '../services';

const searchFields = ['invoice_code'];

const generateObjectSearch = (searchFields) => {
  let searchFieldsObj = {};
  for (let field of searchFields) {
    searchFieldsObj = { ...searchFieldsObj, [field]: 'text' };
  }
  return searchFieldsObj;
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
  await Invoices.collection.createIndex(generateObjectSearch(searchFields));
  await db.disconnect();
};

module.exports.down = async function () {
  const db = await connectDb();
  await Invoices.collection.dropIndexes(searchFields);
  await db.disconnect();
};
