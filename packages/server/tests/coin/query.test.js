import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles, getFirstCoin } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';

const { USER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

//TODO: refactor this to make it be more simple
afterAll(() => (ctx.dbs || []).forEach(db => db && db.disconnect()));

test(
  'get_all_coins should work',
  withRoles(USER, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_all_coins {
          id
          symbol
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_all_coins.length).toBeTruthy();
  })
);

test(
  'get_coin should work',
  withRoles(USER, async ctx => {
    const coinId = (await getFirstCoin()).id;
    const { data, errors } = await execQuery(
      `query ($coinId: ID) {
        get_coin (id: $coinId) {
          id
          name
          symbol
          logo
          status
          createdAt
          updatedAt
        }
      }`,
      { coinId },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_coin).toBeDefined();
  })
);
