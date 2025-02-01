import '../_env';
import mongoose from 'mongoose';
import { SystemUsers } from '../services';
import { findUser } from '../utils';

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

  const admin = await findUser({ username: 'admin' }, SystemUsers);
  const currentSetting = { ...admin.setting };

  currentSetting.maintenance_message = currentSetting.maintenance_messages;
  delete currentSetting.maintenance_messages;

  admin.setting = currentSetting;
  await admin.save();

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await db.disconnect();
};
