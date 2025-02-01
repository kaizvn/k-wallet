import '../_env';
import mongoose from 'mongoose';
import { Users } from '../services';

const searchUserFields = ['first_name', 'last_name', 'email'];

const getSearchFieldsObj = searchUserFields => {
  let searchFieldsObj = {};
  for (let field of searchUserFields) {
    searchFieldsObj = { ...searchFieldsObj, [field]: 'text' };
  }
  return searchFieldsObj;
};

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = (MONGO_DB || 'RevPayment') + '_Test';

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

  const searchUserFieldsObj = getSearchFieldsObj(searchUserFields);
  await Users.collection.createIndex(searchUserFieldsObj);

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await Users.collection.dropIndexes();

  await db.disconnect();
};
