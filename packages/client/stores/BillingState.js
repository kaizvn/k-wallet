import { createErrorSelector } from './UserState';
import { flow, get } from 'lodash/fp';
import { respondToSuccess } from '../middlewares/api-reaction';
import { GetQuickFilterBillsCreator } from '@revtech/rev-shared/apis/creators';

const GetQuickFilterBillsAPI = GetQuickFilterBillsCreator(`
  ... on User {
    id
    fullName
  }
`);

export const getQuickFilterBills = ({
  page = 0,
  pageSize = 9,
  filterContents = ''
}) =>
  respondToSuccess(
    GetQuickFilterBillsAPI.actionCreator({
      filter: { page, pageSize, filterContents: filterContents.trim() }
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
