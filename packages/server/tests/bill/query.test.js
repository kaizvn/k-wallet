import createContext, { ACCOUNT_TYPE } from '../createContext';
import execQuery from '../execQuery';
import { Bills, Transactions } from '../../services';
import { MockBillUser123 } from '../__mocks__/bills';
import { MockBillPartner123 } from '../__mocks__/bills';
import { MockTransactionUser123 } from '../__mocks__/transactions';
import { withRoles } from '../utils';
const { OWNER_123, OWNER_456 } = ACCOUNT_TYPE;
const { USER } = ACCOUNT_TYPE;

let ctx;
const insertBills = bill => new Bills(bill).save();
const insertTransactions = transaction => new Transactions(transaction).save();
beforeAll(async () => {
  ctx = await createContext();
  for (let bill of MockBillUser123) {
    await insertBills(bill);
  }
  for (let bill of MockBillPartner123) {
    await insertBills(bill);
  }
  for (let transaction of MockTransactionUser123) {
    await insertTransactions(transaction);
  }
});

afterAll(async () => {
  await Bills.deleteMany();
  await Transactions.deleteMany();
  (ctx.dbs || []).forEach(db => db && db.disconnect());
});

test(
  'get_quick_filter_bills as USER with filterContents="address_mock_bill_1" as address should work',

  withRoles([USER], async ctx => {
    const caseFilter = {
      page: 0,
      pageSize: 10,
      filterContents: 'address_mock_bill_1'
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
            get_quick_filter_bills (filter: $filter){
                bills {
                    id
                    address
                    transaction {
                      id
                    }
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
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
      { filter: caseFilter },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_bills.bills.length).toBe(1);
  })
);

test(
  'get_quick_filter_bills as USER with filterContents="User Test" as owner name should work',

  withRoles([USER], async ctx => {
    const caseFilter = {
      page: 0,
      pageSize: 10,
      filterContents: 'User Test'
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
            get_quick_filter_bills (filter: $filter){
                bills {
                    id
                    address
                    transaction {
                      id
                    }
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
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
      { filter: caseFilter },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_bills.bills.length).toBe(2);
  })
);

test(
  'get_quick_filter_bills as USER with filterContents="" as address or owner name should work',

  withRoles([USER], async ctx => {
    const caseFilter = {
      page: 0,
      pageSize: 10,
      filterContents: ''
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
            get_quick_filter_bills (filter: $filter){
                bills {
                    id
                    address
                    transaction {
                      id
                    }
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
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
      { filter: caseFilter },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_bills.bills.length).toBe(2);
  })
);

test(
  'get_quick_filter_bills as PARTNER with filterContents="address_mock_bill_2" as address should work',

  withRoles([OWNER_123], async ctx => {
    const caseFilter = {
      page: 0,
      pageSize: 10,
      filterContents: 'address_mock_bill_2'
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
              get_quick_filter_bills (filter: $filter){
                bills {
                    id
                    address
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
                    owner {
                      ... on Partner {
                        id
                        name
                      }
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
      { filter: caseFilter },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_bills.bills.length).toBe(1);
  })
);

test(
  'get_quick_filter_bills as PARTNER with filterContents="Sample Partner 1" as owner name should work',

  withRoles([OWNER_456], async ctx => {
    const caseFilter = {
      page: 0,
      pageSize: 10,
      filterContents: 'Sample Partner 1'
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
              get_quick_filter_bills (filter: $filter){
                bills {
                    id
                    address
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
                    owner {
                      ... on Partner {
                        id
                        name
                      }
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
      { filter: caseFilter },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_bills.bills.length).toBe(1);
  })
);

test(
  'get_quick_filter_bills as PARTNER with filterContents="Sample Partner" as owner name should work',

  withRoles([OWNER_123], async ctx => {
    const caseFilter = {
      page: 0,
      pageSize: 10,
      filterContents: 'Sample Partner'
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
              get_quick_filter_bills (filter: $filter){
                bills {
                    id
                    address
                    trackingId
                    amount
                    actualAmount
                    status
                    type
                    createdAt
                    updatedAt
                    fee
                    owner {
                      ... on Partner {
                        id
                        name
                      }
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
      { filter: caseFilter },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_bills.bills.length).toBe(2);
  })
);

test(
  'get_bill as PARTNER should work',

  withRoles([OWNER_123], async ctx => {
    const id = '7107e90b-c1ea-416c-abab-361c233977e2';
    const { data, errors } = await execQuery(
      `query($id: ID!) {
        get_bill(id: $id) {
          id
          address
          trackingId
          amount
          actualAmount
          status
          type
          createdAt
          updatedAt
          fee
          coin {
            id
            name
            symbol
            logo
          }
          owner {
            ... on Partner {
              id
              name
            }
          }
        }
      }`,
      { id },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_bill).toBeDefined();
  })
);
