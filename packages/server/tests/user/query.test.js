import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles, getFirstUser } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';

const { ADMIN, MODERATOR, OWNER, MEMBER, USER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

afterAll(() => (ctx.dbs || []).forEach(db => db && db.disconnect()));

test(
  'login_normal_user as NON-USER should work',
  withRoles(null, async ctx => {
    const inputs = {
      username: 'user123',
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

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.login_normal_user).toBeDefined();
  })
);

test(
  'get_normal_users as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_normal_users {
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
          token
          status
          createdAt
          updatedAt
          mccCode
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_normal_users.length).toBeTruthy();
  })
);

test(
  'get_normal_user as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = {
      id: (await getFirstUser()).id
    };

    const { data, errors } = await execQuery(
      `query ($id: ID!) {
        get_normal_user (id: $id) {
          id
          username
          fullName
          age
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_normal_user).toBeDefined();
  })
);

test(
  'me as USER should work',
  withRoles([ADMIN, MODERATOR, OWNER, MEMBER, USER], async ctx => {
    const fragment = `
      id
      username
      fullName`;
    const { data, errors } = await execQuery(
      `query {
        me {
          ...on User {
            ${fragment}
          }
          ...on PartnerUser {
            ${fragment}
          }
          ...on SystemUser {
            ${fragment}
          }
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.me).toBeDefined();
  })
);

test(
  'get_received_user as POWNER should work',
  withRoles(OWNER, async ctx => {
    const inputs = {
      username: (await getFirstUser()).username
    };

    const { data, errors } = await execQuery(
      `query ($username: String!) {
        get_received_user (username: $username) {
          id
          username
          fullName
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_received_user).toBeDefined();
  })
);

test(
  'get_account_setting as MEMBER should work',
  withRoles(MEMBER, async ctx => {
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
