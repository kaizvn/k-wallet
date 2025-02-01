import { getFirstEwallet, getFirstUser, withRoles } from '../utils';
import createContext, { ACCOUNT_TYPE } from '../createContext';
import execQuery from '../execQuery';

const { ADMIN, MODERATOR, USER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

//TODO: refactor this to make it be more simple
afterAll(() => (ctx.dbs || []).forEach(db => db && db.disconnect()));

test(
  'get_all_user_ewallets as SYSUSER should work',
  withRoles([ADMIN, MODERATOR], async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_all_user_ewallets {
          id
          name
          owner {
            ... on Partner {
              id
              name
            }
            ... on User {
              id
              username
            }
          }
          coin {
            id
            name
          }
          type
          balance
          createdAt
          updatedAt
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_all_user_ewallets.length).toBeTruthy();
  })
);

test(
  'get_user_ewallet as SYSUSER should work',
  withRoles([ADMIN, MODERATOR], async ctx => {
    const ewalletId = (await getFirstEwallet()).id;
    const { data, errors } = await execQuery(
      `query ($ewalletId: ID!) {
        get_user_ewallet (id: $ewalletId) {
          id
          name
          owner {
            ... on Partner {
              id
              name
            }
            ... on User {
              id
              username
            }
          }
          coin {
            id
            name
          }
          type
          balance
          createdAt
          updatedAt
        }
      }`,
      { ewalletId },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_user_ewallet).toBeDefined();
  })
);

test(
  'get_user_ewallets as SYSUSER should work',
  withRoles([ADMIN, MODERATOR], async ctx => {
    const userId = (await getFirstUser()).id;
    const { data, errors } = await execQuery(
      `query ($id: ID) {
        get_user_ewallets (id: $id) {
          id
          name
          owner {
            ... on Partner {
              id
              name
            }
            ... on User {
              id
              username
            }
          }
          coin {
            id
            name
          }
          type
          balance
          createdAt
          updatedAt
        }
      }`,
      { userId },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_user_ewallets).toBeDefined();
  })
);

test(
  'get_my_ewallets should work',
  withRoles(USER, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_my_ewallets {
          id
          name
          owner {
            ... on Partner {
              id
              name
            }
            ... on User {
              id
              username
            }
          }
          coin {
            id
            name
          }
          type
          balance
          createdAt
          updatedAt
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_my_ewallets.length).toBeTruthy();
  })
);

test(
  'get_quick_filter_ewallets should work',
  withRoles([ADMIN, MODERATOR], async ctx => {
    const filter = { page: 0, pageSize: 10, filterContents: '' };
    const { data, errors } = await execQuery(
      `  query($filter: FilterTable!) {
          get_quick_filter_ewallets(filter: $filter) {
            ewallets {
              id
              name
              owner {
                ... on Partner {
                  id
                  name
                }
                ... on User {
                  id
                  username
                }
              }
              coin {
                id
                name
              }
              type
              balance
              createdAt
              updatedAt
            }
            pageInfos {
              totalCount
              filter {
                page
                pageSize
              }
            }
          }
        }`,
      { filter },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_ewallets.ewallets.length).toBeTruthy();
  })
);
