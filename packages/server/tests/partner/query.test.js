import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles, getFirstPartner } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';

const { ADMIN, MODERATOR, OWNER, USER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

//TODO: refactor this to make it be more simple
afterAll(() => (ctx.dbs || []).forEach(db => db && db.disconnect()));

test(
  'get_partners as SYSUSER should work',
  withRoles([ADMIN, MODERATOR], async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_partners {
          id
          partnerId
          name
          phone
          email
          address
          owner {
            id
            username
          }
          members {
            id
            username
          }
          status
          createdAt
          updatedAt
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_partners.length).toBeTruthy();
  })
);

test(
  'get_quick_filter_partners as SYSUSER should work',
  withRoles([ADMIN], async ctx => {
    const filter_partner_1 = {
      page: 0,
      pageSize: 10,
      filterContents: ''
    };
    const { data, errors } = await execQuery(
      `query($filter: FilterTable!) {
        get_quick_filter_partners(filter: $filter) {
          partners {
            id
            partnerId
            name
            status
            createdAt
            email
            owner {
              id
              email
              fullName
            }
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
      { filter: filter_partner_1 },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_partners).toBeTruthy();
    expect(data.get_quick_filter_partners.partners).not.toHaveLength(0);
  })
);

test(
  'get_quick_filter_partners as SYSUSER should work',
  withRoles([ADMIN], async ctx => {
    const filter_partner_2 = {
      page: 0,
      pageSize: 10,
      filterContents: 'partner1'
    };
    const { data, errors } = await execQuery(
      `query($filter: FilterTable!) {
        get_quick_filter_partners(filter: $filter) {
          partners {
            id
            partnerId
            name
            status
            createdAt
            email
            owner {
              id
              email
              fullName
            }
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
      { filter: filter_partner_2 },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_partners).toBeTruthy();
    expect(data.get_quick_filter_partners.partners.length).toBe(0);
  })
);

test(
  'get_quick_filter_partners with partner name keyword',
  withRoles([ADMIN], async ctx => {
    const filter_partner_3 = {
      page: 0,
      pageSize: 10,
      filterContents: 'partner 1'
    };
    const { data, errors } = await execQuery(
      `query($filter: FilterTable!) {
        get_quick_filter_partners(filter: $filter) {
          partners {
            id
            partnerId
            name
            status
            createdAt
            email
            owner {
              id
              email
              fullName
            }
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
      { filter: filter_partner_3 },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_partners).toBeTruthy();
    expect(data.get_quick_filter_partners.partners.length).toBe(2);
  })
);

test(
  'get_quick_filter_partners with email keyword',
  withRoles([ADMIN], async ctx => {
    const filter_partner_4 = {
      page: 0,
      pageSize: 10,
      filterContents: 'hello@'
    };
    const { data, errors } = await execQuery(
      `query($filter: FilterTable!) {
        get_quick_filter_partners(filter: $filter) {
          partners {
            id
            partnerId
            name
            status
            createdAt
            email
            owner {
              id
              email
              fullName
            }
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
      { filter: filter_partner_4 },
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_partners).toBeTruthy();
    expect(data.get_quick_filter_partners.partners.length).toBe(2);
  })
);
test(
  'get_partner as SYSUSER should work',
  withRoles([ADMIN, MODERATOR], async ctx => {
    const partnerId = (await getFirstPartner()).id;
    const inputs = { partnerId };

    const { data, errors } = await execQuery(
      `query ($partnerId: ID!) {
        get_partner (id: $partnerId) {
          id
          partnerId
          name
          phone
          email
          address
          owner {
            id
            username
          }
          members {
            id
            username
          }
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
    expect(data.get_partner).toBeDefined();
  })
);

test(
  'get_current_partner as POWNER should work',
  withRoles(OWNER, async ctx => {
    const { data, errors } = await execQuery(
      `query {
        get_current_partner {
          id
          partnerId
          name
          phone
          email
          address
          owner {
            id
            username
          }
          members {
            id
            username
          }
          status
          createdAt
          updatedAt
        }
      }`,
      null,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_current_partner).toBeDefined();
  })
);

test(
  'get_paid_partner as USER with id param should work',
  withRoles(USER, async ctx => {
    const partnerId = (await getFirstPartner()).id;
    const inputs = {
      id: partnerId
    };
    const { data, errors } = await execQuery(
      `query ($id: ID, $partnerId: String){
        get_paid_partner (id: $id, partnerId: $partnerId) {
          id
          partnerId
          name
          phone
          email
          address
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_paid_partner).toBeDefined();
  })
);

test(
  'get_paid_partner as USER with partnerId param should work',
  withRoles(USER, async ctx => {
    const partnerId = (await getFirstPartner()).partner_id;
    const inputs = {
      partnerId: partnerId
    };
    const { data, errors } = await execQuery(
      `query ($id: ID, $partnerId: String){
        get_paid_partner (id: $id, partnerId: $partnerId) {
          id
          partnerId
          name
          phone
          email
          address
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_paid_partner).toBeDefined();
  })
);
