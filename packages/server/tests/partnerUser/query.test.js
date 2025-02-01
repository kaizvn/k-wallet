import createContext from '../createContext';
import execQuery from '../execQuery';
import { withRoles, getFirstPartner } from '../utils';
import { ACCOUNT_TYPE } from '../createContext';

const { ADMIN, OWNER, USER } = ACCOUNT_TYPE;

let ctx;
beforeAll(async () => {
  ctx = await createContext();
});

//TODO: refactor this to make it be more simple
afterAll(() => (ctx.dbs || []).forEach(db => db && db.disconnect()));

const getPartnerMembers = (ctx, inputs) => {
  return execQuery(
    `query ($partnerId: ID) {
        get_partner_members (partnerId: $partnerId) {
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
};

test(
  'get_partner_members as ADMIN should work',
  withRoles(ADMIN, async ctx => {
    const inputs = { partnerId: (await getFirstPartner()).id };
    const { data, errors } = await getPartnerMembers(ctx, inputs);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_partner_members.length).toBeTruthy();
  })
);

test(
  'get_partner_members as OWNER should work',
  withRoles(OWNER, async ctx => {
    const { data, errors } = await getPartnerMembers(ctx);

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_partner_members.length).toBeTruthy();
  })
);

test(
  'get_partner_member as OWNER should work',
  withRoles(OWNER, async ctx => {
    const members = (await getPartnerMembers(ctx)).data.get_partner_members;

    const inputs = { id: members[0].id };
    const { data, errors } = await execQuery(
      `query ($id: ID!) {
        get_partner_member (id: $id) {
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
    expect(data.get_partner_member).toBeDefined();
  })
);

const getQuickFilterPartnerMembers = (
  ctx,
  inputs = {
    filter: {
      page: 0,
      pageSize: 5,
      filterContents: 'Partner'
    }
  }
) => {
  return execQuery(
    `query ( $filter: FilterTable!) {
        get_quick_filter_partner_members ( filter: $filter) {
          partnerUsers {id
          username
          title
          fullName
          firstName
          lastName}
          pageInfos{
            totalCount
            filter {
              page
              pageSize
              filterContents
            }
          }
        }
      }`,
    inputs,
    ctx
  );
};
test(
  'get_quick_filter_partner_members as OWNER should work',
  withRoles(OWNER, async ctx => {
    const { data, errors } = await getQuickFilterPartnerMembers(ctx);
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_partner_members.partnerUsers.length).toBe(2);
  })
);

test(
  'get_account_setting as OWNER should work',
  withRoles(OWNER, async ctx => {
    const inputs = { userId: (await getFirstPartner()).id };

    const { data, errors } = await execQuery(
      `query {
        get_account_setting {
          timezone
          language
        }
      }`,
      inputs,
      ctx
    );

    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_account_setting).toBeDefined();
  })
);

test(
  'get_account_setting as USER should work',
  withRoles(USER, async ctx => {
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
