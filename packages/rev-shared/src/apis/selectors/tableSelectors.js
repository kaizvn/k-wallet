import { flow, get } from 'lodash/fp';
import { GetQuickFilterPaymentsListAPI } from '../apiCollections/tableAPI';
import { createErrorSelector } from '../libs';

export const getQuickFilterPaymentsListSelector = flow(
  GetQuickFilterPaymentsListAPI.dataSelector,
  get('data.get_quick_filter_payments')
);

export const getQuickFilterPaymentsErrorSelector = createErrorSelector(
  GetQuickFilterPaymentsListAPI
);
