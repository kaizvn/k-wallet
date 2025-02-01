import '../_env';

import mongoose from 'mongoose';
import uuid from 'uuid';

import {
  BTC_COIN_ID,
  ETH_COIN_ID,
  RIPPLE_COIN_ID
} from '../graphql/enums/coinId';
import {
  EWallets,
  SystemUsers,
  Partners,
  PartnerUsers,
  Users
} from '../services';
import { P_ACTIVE } from '../graphql/enums/partnerStatus';
import { P_OWNER, SYS_ADMIN } from '../graphql/enums/userRoles';
import { U_ACTIVE } from '../graphql/enums/userStatus';
import { WALLET_USER, WALLET_PARTNER } from '../graphql/enums/walletType';

const user1 = {
  username: 'user1',
  password: '123456',
  title: 'Mr',
  first_name: 'User',
  last_name: '1',
  gender: 1,
  identity: '123456789',
  email: 'user1@gmail.com',
  phone: '0987654321',
  mcc_code: '+84',
  birth_date: '05/25/1990',
  status: U_ACTIVE
};
const partner1Id = uuid();
const partnerOwner1Id = uuid();
const partner1 = {
  id: partner1Id,
  partner_id: 'revpayment',
  name: 'Rev Payment',
  phone: '0987654333',
  email: 'hello@revpayment.io',
  owner_id: partnerOwner1Id,
  status: P_ACTIVE
};
const partnerOwner1 = {
  id: partnerOwner1Id,
  username: 'partnerowner1',
  password: '123456',
  title: 'Mr',
  first_name: 'Partner',
  last_name: 'Owner 1',
  gender: 1,
  identity: '112233445',
  email: 'partnerowner1@gmail.com',
  phone: '0987654444',
  mcc_code: '+84',
  birth_date: '05/25/1990',
  partner_id: partner1Id,
  status: U_ACTIVE,
  role: P_OWNER
};
const partnerMember1 = {
  username: 'partnermember1',
  password: '123456',
  title: 'Mr',
  first_name: 'Partner',
  last_name: 'Member 1',
  gender: 1,
  identity: '111122223',
  email: 'partnermember1@gmail.com',
  phone: '0987655555',
  mcc_code: '+84',
  birth_date: '05/25/1990',
  partner_id: partner1Id,
  status: U_ACTIVE
};
const systemUser1 = {
  username: 'admin',
  password: '123456',
  title: 'Mr',
  first_name: 'System',
  last_name: 'Admin',
  role: SYS_ADMIN,
  status: U_ACTIVE,
  email: 'revpayment.email@gmail.com'
};

const insertSystemUsers = () => new SystemUsers(systemUser1).save();

const insertPartner = async () => {
  const partner = new Partners(partner1);
  const partnerOwner = new PartnerUsers(partnerOwner1);
  const partnerMember = new PartnerUsers(partnerMember1);

  await Promise.all([
    partner.save(),
    partnerOwner.save(),
    partnerMember.save()
  ]);

  return partner;
};

const insertUser = () => new Users(user1).save();

const insertEwallets = async userOrPartner => {
  const coinIds = [BTC_COIN_ID, ETH_COIN_ID, RIPPLE_COIN_ID];

  for (let coinId of coinIds) {
    const ewallet = new EWallets({
      name: 'sampleWallet',
      type: userOrPartner.username ? WALLET_USER : WALLET_PARTNER,
      owner_id: userOrPartner.id,
      coin_id: coinId,
      balance: 0
    });
    await ewallet.save();
  }
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

  await insertSystemUsers();
  const partner = await insertPartner();
  const user = await insertUser();
  await Promise.all([insertEwallets(partner), insertEwallets(user)]);

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  await Promise.all([
    Users.deleteMany({ username: user1.username }),
    PartnerUsers.deleteMany({ username: partnerOwner1.username }),
    PartnerUsers.deleteMany({ username: partnerMember1.username }),
    Partners.deleteMany({ partner_id: partner1.partner_id }),
    SystemUsers.deleteMany({ username: systemUser1.username }),
    EWallets.deleteMany({ name: 'sampleWallet' })
  ]);

  await db.disconnect();
};
