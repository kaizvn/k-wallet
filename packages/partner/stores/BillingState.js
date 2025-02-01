import { createErrorSelector } from './UserState';
import { flow, get } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import {
  GetQuickFilterBillsCreator,
  GetBillDetailsCreator
} from '@revtech/rev-shared/apis/creators';

const GetBillDetailsAPI = GetBillDetailsCreator(`
  ... on Partner {
    id
    name
  }
`);

export const getBillDetails = id =>
  respondToSuccess(GetBillDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.log(resp.errors);
      return;
    }
    return;
  });

export const getBillDetailsSelector = flow(
  GetBillDetailsAPI.dataSelector,
  get('data.get_bill')
);

const GetQuickFilterBillsAPI = GetQuickFilterBillsCreator(`
  ... on Partner {
    id
    name
  }
`);

export const getQuickFilterBills = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterBillsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: filterContents.trim(),
        dateRange
      }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }
      return;
    }
  );

export const getQuickFilterBillsSelector = flow(
  GetQuickFilterBillsAPI.dataSelector,
  get('data.get_quick_filter_bills')
);

export const getQuickFilterBillsErrorSelector = createErrorSelector(
  GetQuickFilterBillsAPI
);
export default {};
