import { respondToSuccess } from '../libs';
import { GetQuickFilterPaymentsListAPI } from '../apiCollections/tableAPI';

export const getQuickFilterPaymentsList = (
  { page = 0, pageSize = 10, searchMessage = '', dateRange },
  callback
) => {
  return respondToSuccess(
    GetQuickFilterPaymentsListAPI.actionCreator({
      filter: { page, pageSize, filterContents: searchMessage, dateRange }
    }),
    (resp, headers, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      return;
    }
  );
};
