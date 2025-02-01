import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles, getFirstUser, getFirstPartner } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';
import { AdminAccount } from '../__mocks__/userAccounts';

import {
  EWallets,
  Users,
  Partners,
  SystemUsers,
  PartnerUsers
} from '../../services';

import { U_ACTIVE } from '../../graphql/enums/userStatus';
import { P_ACTIVE } from '../../graphql/enums/partnerStatus';

const { ADMIN } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

afterAll(async () => {
  await removeData();
  await revertStatus();

  (ctx.dbs || []).forEach(db => db && db.disconnect());
});

const removeData = async () => {
  const partnerUser = await PartnerUsers.findOne({
    email: 'test_invite_partner@gmail.com'
  });

  const admin = await SystemUsers.findOne({ id: AdminAccount.id });
  admin.password = AdminAccount.password;
  await admin.save();

  return Promise.all([
    Users.findOne({ username: 'test_user1' }).deleteOne(),
    SystemUsers.findOne({ username: 'test_mod1' }).deleteOne(),
    partnerUser.deleteOne(),
    Partners.findOne({ owner_id: partnerUser.id }).deleteOne(),
    EWallets.find({ name: 'tempTestWallet' }).deleteMany()
  ]);
};

const revertStatus = async () => {
  getFirstPartner().then(partner => {
    partner.status = P_ACTIVE;
    return partner.save();
  });

  getFirstUser().then(user => {
    user.status = U_ACTIVE;
    return user.save();
  });
};

test(
  'add_user as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      username: 'test_user1',
      password: '123456',
      title: 'Mr',
      firstName: 'Test',
      lastName: 'User 1',
      birthDateString: '05/04/1998',
      email: 'test_user123@gmail.com',
      phone: '0981690658',
      identity: '272111444',
      mccCode: '+84'
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
          $identity: String!
          $mccCode: String!
        ) {
        add_user (
          username: $username
          password: $password
          title: $title
          firstName: $firstName
          lastName: $lastName
          birthDateString: $birthDateString
          email: $email
          phone: $phone
          identity: $identity
          mccCode: $mccCode
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
            mccCode
            identity
            status
            createdAt
            updatedAt
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.add_user).toBeDefined();
  })
);

test(
  'register_system_user as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      username: 'test_mod1',
      password: '123456',
      title: 'Mr',
      firstName: 'Test',
      lastName: 'Mod 1',
      birthDateString: '05/04/1998',
      email: 'test_mod1@gmail.com',
      role: 'MOD'
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
          $role: SystemUserRole!
        ) {
        register_system_user (
          username: $username
          password: $password
          title: $title
          firstName: $firstName
          lastName: $lastName
          birthDateString: $birthDateString
          email: $email
          role: $role
        ) {
            id
            username
            fullName
            role
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.register_system_user).toBeDefined();
  })
);

const updatePartnerStatus = async function(ctx, action) {
  return execQuery(
    `mutation (
          $id: ID!
          $action: UpdateStatusAction!
        ) {
        update_partner_status (
          id: $id
          action: $action
        ) {
            id
            name
            status
          }
        }`,
    { id: (await getFirstPartner()).id, action },
    ctx
  );
};

test(
  'update_partner_status APPROVE as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'APPROVE';

    const { data, errors } = await updatePartnerStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_partner_status.status).toBe('ACTIVE');
  })
);

test(
  'update_partner_status REJECT as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'REJECT';
    const { data, errors } = await updatePartnerStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_partner_status.status).toBe('REJECTED');
  })
);

test(
  'update_partner_status BAN as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'BAN';
    const { data, errors } = await updatePartnerStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_partner_status.status).toBe('BANNED');
  })
);

test(
  'update_partner_status UNBAN as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'UNBAN';
    const { data, errors } = await updatePartnerStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_partner_status.status).toBe('ACTIVE');
  })
);

const updateUserStatus = async (ctx, action) => {
  return execQuery(
    `mutation (
          $id: ID!
          $action: UpdateStatusAction!
        ) {
        update_user_status (
          id: $id
          action: $action
        ) {
            id
            username
            status
          }
        }`,
    { id: (await getFirstUser()).id, action },
    ctx
  );
};

test(
  'update_user_status APPROVE as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'APPROVE';
    const { data, errors } = await updateUserStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_user_status.status).toBe('ACTIVE');
  })
);

test(
  'update_user_status REJECT as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'REJECT';
    const { data, errors } = await updateUserStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_user_status.status).toBe('REJECTED');
  })
);

test(
  'update_user_status BAN as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'BAN';
    const { data, errors } = await updateUserStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_user_status.status).toBe('BANNED');
  })
);

test(
  'update_user_status UNBAN as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const action = 'UNBAN';
    const { data, errors } = await updateUserStatus(ctx, action);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_user_status.status).toBe('ACTIVE');
  })
);

test(
  'invite_partner as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      email: 'test_invite_partner@gmail.com'
    };
    const { data, errors } = await execQuery(
      `mutation ($email: String!) {
        invite_partner (email: $email) {
            id
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.invite_partner).toBeDefined();
  })
);

test(
  'change_system_user_password as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      currentPassword: '123456',
      newPassword: 'testchangepassword'
    };

    const { data, errors } = await execQuery(
      `mutation($currentPassword: String!, $newPassword: String!) {
        change_system_user_password(
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
    expect(data.change_system_user_password).toBeDefined();
  })
);

test(
  'set_account_setting as MEMBER should work',
  withRoles(ADMIN, async ctx => {
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

test(
  'login_system_user as ADMIN with new password should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      username: 'admin',
      password: 'testchangepassword'
    };
    const { data, errors } = await execQuery(
      `query (
          $username: String!
          $password: String!
        ) {
        login_system_user (
          username: $username
          password: $password
        ) {
            id
            username
            fullName
            role
            token
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();

    expect(data.login_system_user).toBeDefined();
  })
);

test(
  'set_general_setting as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      homePageTitle: 'RevPayment System',
      homePageDescription:
        'RevPayment provides a Payment Solution for your CryptoCurrencies: Safe, Fast, Reliable, and Easy to manage.',
      serverStatus: true,
      transferLimit: 10,
      maintenanceMessage: ''
    };

    const { data, errors } = await execQuery(
      `mutation(
        $homePageTitle: String
        $homePageDescription: String
        $serverStatus: Boolean
        $transferLimit: Float
        $maintenanceMessage: String
      ) {
        set_general_setting(
          homePageTitle: $homePageTitle
          homePageDescription: $homePageDescription
          serverStatus: $serverStatus
          transferLimit: $transferLimit
          maintenanceMessage: $maintenanceMessage
        ) {
          homePageTitle
          homePageDescription
          serverStatus
          transferLimit
          maintenanceMessage
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();

    expect(data.set_general_setting).toBeDefined();
  })
);
