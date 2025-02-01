import { Bills, Transactions } from '../../services';
import { MockBill } from '../__mocks__/bills';
import {
  MockTransactionsPartner123EDF,
  MockTransactionsPartner456EDF,
  MockPaymentsPartner123EDF,
  MockPaymentsUser123456
} from '../__mocks__/transactions';
import { withRoles } from '../utils';
import createContext, { ACCOUNT_TYPE } from '../createContext';
import execQuery from '../execQuery';

const {
  // ADMIN, MODERATOR,
  OWNER_123,
  OWNER_456,
  USER
} = ACCOUNT_TYPE;

let ctx;
const insertTransactions = transaction => new Transactions(transaction).save();

const insertBills = () => new Bills(MockBill).save();

beforeAll(async () => {
  ctx = await createContext();
  for (let transaction of MockTransactionsPartner123EDF) {
    await insertTransactions(transaction);
  }
  for (let transaction of MockTransactionsPartner456EDF) {
    await insertTransactions(transaction);
  }
  for (let transaction of MockPaymentsPartner123EDF) {
    await insertTransactions(transaction);
  }
  for (let transaction of MockPaymentsUser123456) {
    await insertTransactions(transaction);
  }

  await insertBills();
});

//TODO: refactor this to make it be more simple
afterAll(async () => {
  await Bills.deleteMany();
  await Transactions.deleteMany();
  (ctx.dbs || []).forEach(db => db && db.disconnect());
});
//Normal Situation
// const filters = [
//   { page: -1, pageSize: 1 },
//   { page: 0, pageSize: -1 },
//   { page: -1, pageSize: -1 }
// ];
//
// for (let filter of filters) {
//   test(
//     'get_quick_filter_transactions as SYSUSER should work',
//
//     withRoles([ADMIN, MODERATOR], async ctx => {
//       const { data, errors } = await execQuery(
//         `query ($filter: FilterTable!){
//           get_quick_filter_transactions (filter : $filter){
//             transactions {id
//             amount
//             status
//             description
//             createdAt
//           }
//           }
//         }`,
//         { filter },
//         ctx
//       );
//       expect(errors).toBeUndefined();
//       expect(data.errors).toBeUndefined();
//       expect(data.get_quick_filter_transactions.transactions.length).toBe(5);
//     })
//   );
// }
// //Special Situation
// // base on total_items = 5
//
// test(
//   'get_quick_filter_transactions as SYSUSER should work as expected page is out of range',
//
//   withRoles([ADMIN, MODERATOR], async ctx => {
//     const specialCaseFilter_1 = { page: 3, pageSize: 2 };
//     const { data, errors } = await execQuery(
//       `query ($filter: FilterTable!){
//         get_quick_filter_transactions (filter : $filter){
//           transactions {id
//           amount
//           status
//           description
//           createdAt
//         }
//         pageInfos {
//           totalCount
//           filter {
//             page
//             pageSize
//           }
//         }
//         }
//       }`,
//       { filter: specialCaseFilter_1 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_transactions.transactions.length).toBe(0);
//   })
// );
//
// test(
//   'get_quick_filter_transactions as SYSUSER should work as expected page is out of range',
//
//   withRoles([ADMIN, MODERATOR], async ctx => {
//     const specialCaseFilter_2 = { page: 0, pageSize: 10 };
//     const { data, errors } = await execQuery(
//       `query ($filter: FilterTable!){
//         get_quick_filter_transactions (filter : $filter){
//           transactions {id
//           amount
//           status
//           description
//           createdAt
//         }
//         pageInfos {
//           totalCount
//           filter {
//             page
//             pageSize
//           }
//         }
//         }
//       }`,
//       { filter: specialCaseFilter_2 },
//       ctx
//     );
//     expect(errors).toBeUndefined();
//     expect(data.errors).toBeUndefined();
//     expect(data.get_quick_filter_transactions.transactions.length).toBe(9);
//   })
// );

test(
  'get_quick_filter_transactions as OWNER of partner-123-edf  should work',

  withRoles(OWNER_123, async ctx => {
    const specialCaseFilter_3 = { page: 0, pageSize: 5 };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
        get_quick_filter_transactions (filter : $filter){
          transactions {id
          amount
          status
          description
          createdAt
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
      { filter: specialCaseFilter_3 },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_transactions.transactions.length).toBe(4);
  })
);

test(
  'get_quick_filter_transactions as OWNER of partner-456-edf  should work',

  withRoles(OWNER_456, async ctx => {
    const specialCaseFilter_4 = { page: 0, pageSize: 5 };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
        get_quick_filter_transactions (filter : $filter){
          transactions {id
          amount
          status
          description
          createdAt
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
      { filter: specialCaseFilter_4 },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_transactions.transactions.length).toBe(4);
  })
);

test(
  'get_quick_filter_transactions as USER with filterContents="partner" should work as expected page is out of range',

  withRoles([USER], async ctx => {
    const specialCaseFilter_5 = {
      page: 0,
      pageSize: 10,
      filterContents: 'partner'
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
        get_quick_filter_transactions (filter : $filter){
          transactions {id
          amount
          status
          description
          createdAt
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
      { filter: specialCaseFilter_5 },
      ctx
    );
    expect(errors).toBeUndefined();
    expect(data.errors).toBeUndefined();
    expect(data.get_quick_filter_transactions.transactions.length).toBe(8);
  })
);

test(
  'get_quick_filter_payments as USER should work as expected page is out of range',

  withRoles([USER], async ctx => {
    const filter = {
      page: 0,
      pageSize: 10,
      filterContents: ''
    };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
        get_quick_filter_payments (filter : $filter){
          transactions {id
          amount
          status
          description
          createdAt
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
    expect(data.get_quick_filter_payments.transactions.length).toBe(1);
  })
);

test(
  'get_quick_filter_payments as OWNER of partner-123-edf  should work',

  withRoles(OWNER_123, async ctx => {
    const filter = { page: 0, pageSize: 5 };
    const { data, errors } = await execQuery(
      `query ($filter: FilterTable!){
        get_quick_filter_payments (filter : $filter){
          transactions {id
          amount
          status
          description
          createdAt
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
    expect(data.get_quick_filter_payments.transactions.length).toBe(1);
  })
);
