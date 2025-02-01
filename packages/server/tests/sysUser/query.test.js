import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles, getFirstSysUser, getFirstPartnerUser } from '../utils';

import { ACCOUNT_TYPE } from '../createContext';

const { ADMIN } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

//TODO: refactor this to make it be more simple
afterAll(() => (ctx.dbs || []).forEach(db => db && db.disconnect()));

test(
  'login_system_user as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      username: 'admin',
      password: '123456'
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
  'get_system_users as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_system_users {
          id
          username
          firstName
          lastName
          role
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_system_users.length).toBeTruthy();
  })
);

test(
  'get_system_user as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      id: (await getFirstSysUser()).id
    };

    const { data, errors } = await execQuery(
      `query ($id: ID!) {
        get_system_user (id: $id) {
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
    expect(data.get_system_user).toBeTruthy();
  })
);

test(
  'get_partner_users as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_partner_users {
          id
          username
          fullName
          role
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_partner_users).toBeTruthy();
  })
);

test(
  'get_partner_user as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      id: (await getFirstPartnerUser()).id
    };

    const { data, errors } = await execQuery(
      `query ($id: ID!) {
        get_partner_user (id: $id) {
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
    expect(data.get_partner_user).toBeTruthy();
  })
);

test(
  'get_partner_owners as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_partner_owners {
          id
          username
          fullName
          role
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_partner_owners).toBeTruthy();
  })
);

// const filter_partner_users_1 = {
//   filterContents: 'Partner'
// };

// test(
//   'get_quick_filter_partner_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const { data, errors } = await execQuery(
//       `query($filter : FilterTable!) {
//       get_quick_filter_partner_users (filter : $filter){
//        partnerUsers {id
//         username
//         fullName
//         role
// }
// pageInfos {
//         totalCount
//         filter {
//           page
//           pageSize
//           filterContents
//         }
//       }
//       }
//     }`,
//       { filter: filter_partner_users_1 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_partner_users).toBeTruthy();
//     expect(data.get_quick_filter_partner_users.partnerUsers.length).toBe(3);
//   })
// );

// const filter_partner_users_2 = {
//   filterContents: 'Member'
// };

// test(
//   'get_quick_filter_partner_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const { data, errors } = await execQuery(
//       `query($filter : FilterTable!) {
//       get_quick_filter_partner_users (filter : $filter){
//        partnerUsers {id
//         username
//         fullName
//         role
// }
// pageInfos {
//         totalCount
//         filter {
//           page
//           pageSize
//           filterContents
//         }
//       }
//       }
//     }`,
//       { filter: filter_partner_users_2 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_partner_users).toBeTruthy();
//     expect(data.get_quick_filter_partner_users.partnerUsers.length).toBe(1);
//   })
// );

// const filter_partner_users_4 = {
//   page: 0,
//   pageSize: 5,
//   filterContents: 'Partner'
// };

// test(
//   'get_quick_filter_partner_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const { data, errors } = await execQuery(
//       `query($filter : FilterTable!) {
//       get_quick_filter_partner_users (filter : $filter){
//        partnerUsers {id
//         username
//         fullName
//         role
// }
// pageInfos {
//         totalCount
//         filter {
//           page
//           pageSize
//           filterContents
//         }
//       }
//       }
//     }`,
//       { filter: filter_partner_users_4 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_partner_users).toBeTruthy();
//     expect(data.get_quick_filter_partner_users.partnerUsers.length).toBe(3);
//   })
// );

// const filter_partner_users_5 = {
//   page: 1,
//   pageSize: 0,
//   filterContents: JSON.stringify({ name: 'Partner', email: 'Partner' })
// };

// test(
//   'get_quick_filter_partner_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const { data, errors } = await execQuery(
//       `query($filter : FilterTable!) {
//       get_quick_filter_partner_users (filter : $filter){
//        partnerUsers {id
//         username
//         fullName
//         role
// }
// pageInfos {
//         totalCount
//         filter {
//           page
//           pageSize
//           filterContents
//         }
//       }
//       }
//     }`,
//       { filter: filter_partner_users_5 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_partner_users).toBeTruthy();
//     expect(data.get_quick_filter_partner_users.partnerUsers.length).toBe(0);
//   })
// );
// test(
//   'get_quick_filter_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const filter_user_1 = {
//       page: 0,
//       pageSize: 10,
//       filterContents: ''
//     };
//     const { data, errors } = await execQuery(
//       `query($filter: FilterTable!) {
//         get_quick_filter_users(filter: $filter) {
//           users {
//             id
//             username
//             fullName
//             email
//             status
//             createdAt
//           }
//           pageInfos {
//             totalCount
//             filter {
//               page
//               pageSize
//             }
//           }
//         }
//       }`,
//       { filter: filter_user_1 },
//       ctx
//     );

//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_users).toBeTruthy();
//     expect(data.get_quick_filter_users.users).toBeDefined();
//   })
// );

// test(
//   'get_quick_filter_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const filter_user_2 = {
//       page: 0,
//       pageSize: 10,
//       filterContents: 'test_user1'
//     };
//     const { data, errors } = await execQuery(
//       `query($filter: FilterTable!) {
//         get_quick_filter_users(filter: $filter) {
//           users {
//             id
//             username
//             fullName
//             email
//             status
//             createdAt
//           }
//           pageInfos {
//             totalCount
//             filter {
//               page
//               pageSize
//             }
//           }
//         }
//       }`,
//       { filter: filter_user_2 },
//       ctx
//     );

//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_users).toBeTruthy();
//     expect(data.get_quick_filter_users.users.length).toBe(1);
//   })
// );

// test(
//   'get_quick_filter_users as ADMIN should work',
//   withRoles(ADMIN, async ctx => {
//     const filter_user_3 = {
//       page: 0,
//       pageSize: 10,
//       filterContents: 'test_user_abcd_exyz'
//     };
//     const { data, errors } = await execQuery(
//       `query($filter: FilterTable!) {
//         get_quick_filter_users(filter: $filter) {
//           users {
//             id
//             username
//             fullName
//             email
//             status
//             createdAt
//           }
//           pageInfos {
//             totalCount
//             filter {
//               page
//               pageSize
//             }
//           }
//         }
//       }`,
//       { filter: filter_user_3 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_users).toBeTruthy();
//     expect(data.get_quick_filter_users.users.length).toBe(0);
//   })
// );

test(
  'get_account_setting as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_account_setting {
          timezone
          language
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_account_setting).toBeDefined();
  })
);

test(
  'get_general_setting as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_general_setting{
          homePageTitle
          homePageDescription
          serverStatus
          transferLimit
          maintenanceMessage
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_general_setting).toBeDefined();
  })
);
