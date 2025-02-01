import '../_env';
import mongoose from 'mongoose';
import { SystemUsers, Settings } from '../services';
import { SYS_ADMIN_SETTINGS } from '../graphql/enums/settingTypes';
import { findUser } from '../utils';

const DEFAULT_TRANSFER_LIMIT_PER_DAY =
  process.env.DEFAULT_TRANSFER_LIMIT_PER_DAY || 10;

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

const settingsData = {
  homepage_title: 'RevPayment',
  homepage_description:
    'RevPayment provides a Payment Solution for your CryptoCurrencies: Safe, Fast, Reliable, and Easy to manage.',
  is_server_active: true,
  limit_transfer: parseInt(DEFAULT_TRANSFER_LIMIT_PER_DAY),
  maintenance_messages: ''
};

module.exports.up = async function() {
  const db = await connectDb();

  const admin = await findUser({ username: 'admin' }, SystemUsers);
  admin.setting = settingsData;

  const accountSettings = new Settings({
    type: SYS_ADMIN_SETTINGS,
    owner_id: admin.id,
    timezone: 'Europe/London',
    language: 'en'
  });

  await admin.save();
  await accountSettings.save();
  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await db.disconnect();
};
