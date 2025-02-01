import '../_env';

import mongoose from 'mongoose';

import {
  AdminAccount,
  ModAccount,
  CustomerAccount,
  CustomerAccount1,
  PartnerOwnerAccount,
  PartnerOwnerAccount1,
  PartnerMemberAccount,
  UserAccountTestChangePass
} from '../tests/__mocks__/userAccounts';
import {
  BTC_COIN_ID,
  ETH_COIN_ID,
  RIPPLE_COIN_ID
} from '../graphql/enums/coinId';
import {
  Coins,
  EWallets,
  Partners,
  PartnerUsers,
  SystemUsers,
  Users
} from '../services';
import { MockPartner, MockPartner1 } from '../tests/__mocks__/partners';
import { WALLET_USER, WALLET_PARTNER } from '../graphql/enums/walletType';

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

const insertCoins = async () => {
  const coinsData = [
    {
      id: ETH_COIN_ID,
      name: 'ethereum',
      symbol: 'ETH',
      logo: 'https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png',
      status: 1
    },
    {
      id: BTC_COIN_ID,
      name: 'bitcoin',
      symbol: 'BTC',
      logo: 'https://en.bitcoin.it/w/images/en/2/29/BC_Logo_.png',
      status: 0
    },
    {
      id: RIPPLE_COIN_ID,
      name: 'ripple',
      symbol: 'XRP',
      logo: 'https://i.ya-webdesign.com/images/ripple-coin-png-7.png',
      status: 0
    }
  ];

  for (let coinData of coinsData) {
    await new Coins(coinData).save();
  }
};

const dropDb = () => {
  mongoose.connection.db.dropDatabase();
};

const insertSystemUsers = () => {
  Promise.all([
    new SystemUsers(AdminAccount).save(),
    new SystemUsers(ModAccount).save()
  ]);
};

const insertUsers = () =>
  Promise.all([
    new Users(CustomerAccount).save(),
    new Users(CustomerAccount1).save(),
    new Users(UserAccountTestChangePass).save()
  ]);

const insertPartnerOwners = () =>
  Promise.all([
    new PartnerUsers(PartnerOwnerAccount).save(),
    new PartnerUsers(PartnerOwnerAccount1).save()
  ]);

const insertPartnerMembers = () =>
  new PartnerUsers(PartnerMemberAccount).save();

const insertPartners = () =>
  Promise.all([
    new Partners(MockPartner).save(),
    new Partners(MockPartner1).save()
  ]);

const insertEwallets = async userOrPartner => {
  const coinIds = [BTC_COIN_ID, ETH_COIN_ID, RIPPLE_COIN_ID];

  for (let coinId of coinIds) {
    const ewallet = new EWallets({
      type: userOrPartner.username ? WALLET_USER : WALLET_PARTNER,
      owner_id: userOrPartner.id,
      coin_id: coinId,
      balance: Math.round(
        Math.random() * 9000000000000000000 + 1000000000000000000
      )
    });
    await ewallet.save();
  }
};

module.exports.up = async function() {
  const db = await connectDb();

  await insertCoins();
  await insertSystemUsers();
  await insertPartnerOwners();
  await insertPartnerMembers();
  const users = await insertUsers();
  const partners = await insertPartners();
  for (let user of users) {
    await insertEwallets(user);
  }
  for (let partner of partners) {
    await insertEwallets(partner);
  }

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await dropDb();

  await db.disconnect();
};
