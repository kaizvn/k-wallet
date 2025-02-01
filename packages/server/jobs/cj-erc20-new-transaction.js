const getNewTransactionCJ = async () => {
  console.log('Get new deposit transactions');
  try {
  } catch (e) {
    console.log('getNewTransactions error: ', e);
  }
};

export default {
  name: 'Get New Transactions',
  interval: '0 */5 * * * *',
  handler: getNewTransactionCJ
};
