import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';
import {
  UserAccountTestChangePass,
  UserAccountTestResetPass
} from '../__mocks__/userAccounts';
import { EWallets, Users } from '../../services';

const { USER, USER_TEST_CHANGEPASS } = ACCOUNT_TYPE;

let ctx;

beforeAll(async () => {
  ctx = await createContext();
  new Users(UserAccountTestResetPass).save();
});

afterAll(async () => {
  await removeData();

  (ctx.dbs || []).forEach(db => db && db.disconnect());
});

const removeData = async () => {
  const user = await Users.findOne({ id: UserAccountTestChangePass.id });
  user.password = UserAccountTestChangePass.password;
  await user.save();

  const userResetPW = await Users.findOne({ id: UserAccountTestResetPass.id });

  await userResetPW.deleteOne();

  Promise.all([
    // Users.findOne({ username: 'test_user2' }).deleteOne(),
    EWallets.find({ name: 'tempTestWallet' }).deleteMany()
  ]);
};
// NOTE - save this code to further instruction because this actually send out a sms
// test(
//   'register_normal_user as NON-USER should work',
// withRoles(null, async ctx => {
//     const inputs = {
//       username: 'test_user2',
//       password: '123456',
//       title: 'Mr',
//       firstName: 'Test',
//       lastName: 'User 2',
//       birthDateString: '05/04/1998',
//       email: 'test_user2@gmail.com',
//       phone: '0981690658',
//       identity: '272111444',
//       country: 'Vietnam',
//       region: 'HCMC',
//       zipCode: '70800',
//       mccCode: '+84'
//     };

//     const { data, errors } = await execQuery(
//       `mutation (
//           $username: String!
//           $password: String!
//           $title: String!
//           $firstName: String!
//           $lastName: String!
//           $birthDateString: String!
//           $email: String!
//           $phone: String!
//           $identity: String!
//           $country: String
//           $region: String
//           $address: String
//           $zipCode: String
//           $mccCode: String!
//         ) {
//         register_normal_user (
//           username: $username
//           password: $password
//           title: $title
//           firstName: $firstName
//           lastName: $lastName
//           birthDateString: $birthDateString
//           email: $email
//           phone: $phone
//           identity: $identity
//           mccCode: $mccCode
//         ) {
//             id
//             username
//             title
//             fullName
//             firstName
//             lastName
//             birthDate
//             birthDay
//             birthMonth
//             birthYear
//             age
//             gender
//             email
//             phone
//             mccCode
//             identity
//             status
//             createdAt
//             updatedAt
//           }
//         }`,
//       inputs,
//       ctx
//     );

//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.register_normal_user).toBeDefined();
//     await insertEwallets(data.register_normal_user);
//   })
// );

test(
  'edit_my_info as USER should work',
  withRoles(USER, async ctx => {
    const inputs = {
      title: 'Mr',
      firstName: 'Edit',
      lastName: 'Info Test 1',
      birthDateString: '10/14/1992',
      email: 'test_edit_info1@gmail.com',
      identity: '123456789'
    };

    const fragment = `
      id
      username
      fullName
      age
      gender`;

    const { data, errors } = await execQuery(
      `mutation (
          $title: String
          $firstName: String
          $lastName: String
          $birthDateString: String
          $email: String
          $identity: String
        ) {
        edit_my_info (
          title: $title
          firstName: $firstName
          lastName: $lastName
          birthDateString: $birthDateString
          email: $email
          identity: $identity
        ) {
            ...on PartnerUser {
              ${fragment}
            }
            ...on SystemUser {
              ${fragment}
            }
            ...on User {
              ${fragment}
            }
          }
        }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.edit_my_info).toBeDefined();
  })
);

test(
  'change_user_password as USER should work',
  withRoles(USER_TEST_CHANGEPASS, async ctx => {
    const inputs = {
      currentPassword: '123456',
      newPassword: 'vothanhquy'
    };

    const { data, errors } = await execQuery(
      `mutation($currentPassword: String!, $newPassword: String!) {
        change_user_password(
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
    expect(data.change_user_password).toBeDefined();
  })
);

test(
  'login_normal_user as NON-USER should work',
  withRoles(null, async ctx => {
    const inputs = {
      username: 'user789',
      password: '123456'
    };

    const { data, errors } = await execQuery(
      `query (
          $username: String!
          $password: String!
        ) {
        login_normal_user (
          username: $username
          password: $password
        ) {
            id
            username
            fullName
            age
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
  'set_account_setting as USER should work',
  withRoles(USER, async ctx => {
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
