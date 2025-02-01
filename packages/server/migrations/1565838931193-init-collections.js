import '../_env';
import mongoose from 'mongoose';

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

const mustHaveCollections = [
  'bills',
  'coins',
  'ewallets',
  'partners',
  'partnerusers',
  'systemusers',
  'transactions',
  'users',
  'walletaddresses',
  'walletkeys'
];

module.exports.up = async function() {
  const db = await connectDb();
  const nativeDriver = mongoose.connection.db;
  const existedCollections = (
    await nativeDriver.listCollections().toArray()
  ).map(collection => collection.name);

  const needToAdd = mustHaveCollections.filter(
    collection => !existedCollections.includes(collection)
  );

  for (let collection of needToAdd) {
    await nativeDriver.createCollection(collection);
  }
  await db.disconnect();
};

module.exports.down = function(next) {
  next();
};
