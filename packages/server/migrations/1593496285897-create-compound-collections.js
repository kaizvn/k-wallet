import '../_env';
import mongoose from 'mongoose';

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

module.exports.up = async function (next) {
  const db = await connectDb();
  const nativeDriver = mongoose.connection.db;
  try {
    await nativeDriver.createCollection('compoundrecords');
    await nativeDriver.createCollection('compoundrates');
    await db.disconnect();
    next();
  } catch (e) {
    console.error(e);
    next();
  }
};

module.exports.down = async function (next) {
  next();
};
