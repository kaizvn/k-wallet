import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';

import { Coins } from '../../services';

const { ADMIN, MODERATOR, OWNER, MEMBER, USER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

//TODO: refactor this to make it be more simple
afterAll(async () => {
  await Coins.find({ name: 'testCoin' }).deleteMany();
  (ctx.dbs || []).forEach(db => db && db.disconnect());
});

const coin = {
  name: 'testCoin',
  symbol: 'testCoinSymbol',
  logo: 'testCoinLogo'
};

test(
  'add_new_coin with role ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const { data, errors } = await execQuery(
      `mutation ($name: String!, $symbol: String!, $logo: String) {
        add_new_coin (name: $name, symbol: $symbol, logo: $logo) {
          id
          name
          symbol
          logo
          status
          createdAt
          updatedAt
        }
      }`,
      coin,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.add_new_coin).toBeDefined();
  })
);

test(
  'add_new_coin with role !== ADMIN should not work',
  withRoles([MODERATOR, OWNER, MEMBER, USER], async ctx => {
    const { data, errors } = await execQuery(
      `mutation ($name: String!, $symbol: String!, $logo: String) {
        add_new_coin (name: $name, symbol: $symbol, logo: $logo) {
          id
          name
          symbol
          logo
          status
          createdAt
          updatedAt
        }
      }`,
      coin,
      ctx
    );

    expect(errors).toBeDefined();
    expect(data).toBeNull();
  })
);
