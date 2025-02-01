import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';

import { EWallets } from '../../services';
import { ETH_COIN_ID } from '../../graphql/enums/coinId';

const { OWNER, USER } = ACCOUNT_TYPE;
let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

afterAll(async () => {
  await EWallets.find({
    $or: [{ name: 'testEwallet' }, { name: 'testEwallet1' }]
  }).deleteMany();
  (ctx.dbs || []).forEach(db => db && db.disconnect());
});

test(
  'create_user_ewallet as USER should work',
  withRoles(USER, async ctx => {
    const inputs = {
      name: 'testEwallet',
      coinId: ETH_COIN_ID
    };

    const { data, errors } = await execQuery(
      `mutation ($name: String, $coinId: ID!, $userId: String) {
        create_user_ewallet (name: $name, coinId: $coinId, userId: $userId) {
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
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.create_user_ewallet).toBeDefined();
  })
);

test(
  'create_partner_ewallet as POWNER should work',
  withRoles(OWNER, async ctx => {
    const inputs = {
      name: 'testEwallet',
      coinId: ETH_COIN_ID
    };

    const { data, errors } = await execQuery(
      `mutation ($name: String, $coinId: ID!, $partnerId: String) {
        create_partner_ewallet (name: $name, coinId: $coinId, partnerId: $partnerId) {
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
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.create_partner_ewallet).toBeDefined();
  })
);

test(
  'update_user_ewallet as USER should work',
  withRoles(USER, async ctx => {
    const resp = await execQuery(
      `query {
        get_my_ewallets {
          id
          name
          coin {
            name
          }
        }
      }
      `,
      null,
      ctx
    );

    const ewallets = (resp && resp.data.get_my_ewallets) || {};

    const ewalletId = ewallets.find(({ name }) => name === 'testEwallet').id;

    const inputs = {
      ewalletId,
      name: 'testEwallet1',
      walletAddresses: ['x0000', 'x0001']
    };

    const { data, errors } = await execQuery(
      `mutation ($ewalletId: ID!, $name: String, $walletAddresses: [String!]) {
        update_user_ewallet (id: $ewalletId, name: $name, walletAddresses: $walletAddresses) {
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
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_user_ewallet.name).toBe(inputs.name);
  })
);

test(
  'update_partner_ewallet as POWNER should work',
  withRoles(OWNER, async ctx => {
    const ewallets = (await execQuery(
      `query {
        get_my_ewallets {
          id
          name
          coin {
            name
          }
        }
      }
      `,
      null,
      ctx
    )).data.get_my_ewallets;

    const ewalletId = ewallets.find(({ name }) => name === 'testEwallet').id;

    const inputs = {
      ewalletId,
      name: 'testEwallet1',
      walletAddresses: ['x0000', 'x0001']
    };

    const { data, errors } = await execQuery(
      `mutation ($ewalletId: ID!, $name: String, $walletAddresses: [String!]) {
        update_partner_ewallet (id: $ewalletId, name: $name, walletAddresses: $walletAddresses) {
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
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.update_partner_ewallet.name).toBe(inputs.name);
  })
);
