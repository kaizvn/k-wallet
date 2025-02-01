import { EWallets, PartnerUsers, Partners } from '../../services';
import { PartnerAccountTestChangePass } from '../__mocks__/userAccounts';
import { withRoles } from '../utils';
import createContext, { ACCOUNT_TYPE } from '../createContext';
import execQuery from '../execQuery';
import { PartnerAccountTestResetPass } from '../__mocks__/userAccounts';

const { OWNER, PARTNER_TEST_CHANGEPASS, MEMBER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
  new PartnerUsers(PartnerAccountTestResetPass).save();
});

afterAll(async () => {
  await removeData();
  (ctx.dbs || []).forEach(db => db && db.disconnect());
});

const removeData = async () => {
  return Promise.all([
    PartnerUsers.deleteOne({ id: PartnerAccountTestChangePass.id }),
    PartnerUsers.deleteMany({
      username: 'test_partner_user1'
    }),
    PartnerUsers.deleteMany({
      email: 'pmem1@registerpartner1.com'
    }),
    Partners.deleteMany({
      partner_id: 'registerpartner1'
    }),
    EWallets.find({
      name: 'tempTestWallet'
    }).deleteMany()
  ]);
};

test(
  'register_partner_user as NON-USER should work',
  withRoles(null, async ctx => {
    const inputs = {
      username: 'test_partner_user1',
      password: '123456',
      title: 'Mr',
      firstName: 'Test',
      lastName: 'Partner User 1',
      birthDateString: '03/15/1993',
      email: 'tester@registerpartner1.com',
      phone: '0981690658',
      mccCode: '+84',
      identity: '272111444',
      partnerId: 'registerpartner1',
      partnerName: 'Created by non-user',
      partnerPhone: '0985609618',
      partnerEmail: 'admin@registerpartner1.com',
      partnerAddress: '72 st 2, HCMC'
    };

    const { data, errors } = await execQuery(
      `mutation (
          $username: String!
          $password: String!
          $title: String!
          $firstName: String!
          $lastName: String!
          $birthDateString: String!
          $email: String!
          $phone: String!
          $mccCode: String!
          $identity: String!
          $partnerId: ID
          $partnerName: String!
          $partnerPhone: String
          $partnerEmail: String
          $partnerAddress: String
        ) {
        register_partner_user (
          username: $username
          password: $password
          title: $title
          firstName: $firstName
          lastName: $lastName
          birthDateString: $birthDateString
          email: $email
          phone: $phone
          mccCode: $mccCode
          identity: $identity
          partnerId: $partnerId
          partnerName: $partnerName
          partnerPhone: $partnerPhone
          partnerEmail: $partnerEmail
          partnerAddress: $partnerAddress
        ) {
            id
            username
            title
            fullName
            firstName
            lastName
            birthDate
            birthDay
            birthMonth
            birthYear
            age
            gender
            email
            phone
            identity
            mccCode
            token
            status
            createdAt
            updatedAt
            role
            partner {
              id
              name
            }
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.register_partner_user).toBeDefined();
  })
);

test(
  'invite_member as POWNER should work',
  withRoles(OWNER, async ctx => {
    const inputs = { email: 'pmem1@registerpartner1.com' };

    const { data, errors } = await execQuery(
      `mutation ($email: String) {
        invite_member (email: $email) {
            id
            email
            status
            createdAt
            updatedAt
            role
            partner {
              id
              name
            }
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.invite_member).toBeDefined();
  })
);

test(
  'register_partner_member as NON-USER should work',
  withRoles(null, async ctx => {
    const memId = (await PartnerUsers.findOne({
      email: 'pmem1@registerpartner1.com'
    })).id;

    const partnerId = (await PartnerUsers.findOne({
      email: 'pmem1@registerpartner1.com'
    })).partner_id;

    const inputs = {
      id: memId,
      username: 'test_partner_member1',
      password: '123456',
      title: 'Mr',
      firstName: 'Test',
      lastName: 'Partner Member 1',
      birthDateString: '02/05/1990',
      email: 'pmem1@registerpartner1.com',
      phone: '0981856096',
      mccCode: '+84',
      identity: '244411127',
      partnerId
    };

    const { data, errors } = await execQuery(
      `mutation (
          $id: ID!
          $username: String!
          $password: String!
          $title: String!
          $firstName: String!
          $lastName: String!
          $partnerId: ID!
          $birthDateString: String!
          $email: String!
          $phone: String!
          $mccCode: String!
          $identity: String!
        ) {
        register_partner_member (
          id: $id
          username: $username
          password: $password
          title: $title
          firstName: $firstName
          lastName: $lastName
          partnerId: $partnerId
          birthDateString: $birthDateString
          email: $email
          phone: $phone
          mccCode: $mccCode
          identity: $identity
        ) {
            id
            username
            title
            fullName
            firstName
            lastName
            birthDate
            birthDay
            birthMonth
            birthYear
            age
            gender
            email
            phone
            identity
            mccCode
            token
            status
            createdAt
            updatedAt
            role
            partner {
              id
              name
            }
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.register_partner_member).toBeDefined();
  })
);

test(
  'change_partner_password as OWNER should work',
  withRoles(PARTNER_TEST_CHANGEPASS, async ctx => {
    const inputs = {
      currentPassword: '123456',
      newPassword: 'testchangepassword'
    };

    const { data, errors } = await execQuery(
      `mutation($currentPassword: String!, $newPassword: String!) {
        change_partner_password(
          currentPassword: $currentPassword
          newPassword: $newPassword
        ) {
          username
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.change_partner_password).toBeDefined();
  })
);

test(
  'login_partner_user as OWNER should work',
  withRoles(null, async ctx => {
    const inputs = {
      username: 'powner111',
      password: '123456'
    };

    const { data, errors } = await execQuery(
      `query (
          $username: String!
          $password: String!
        ) {
          login_partner_user(username: $username, password: $password) {
            id
            fullName
            token
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeDefined();
    expect(data).toBeNull();
  })
);

test(
  'set_account_setting as MEMBER should work',
  withRoles(MEMBER, async ctx => {
    const inputs = {
      timezone: 'Africa/Nairobi',
      language: 'jp'
    };

    const { data, errors } = await execQuery(
      `mutation($timezone: String, $language: String) {
        set_account_setting(timezone: $timezone, language: $language) {
          id
          timezone
          language
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.set_account_setting).toBeDefined();
  })
);
