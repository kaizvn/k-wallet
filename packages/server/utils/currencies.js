import moment from 'moment';

const DATE_RANGE = process.env.GET_TX_DATE_RANGE || 10;

export const getFromDateScan = () => {
  const today = moment();

  return today.subtract(DATE_RANGE, 'days').toDate();
};
