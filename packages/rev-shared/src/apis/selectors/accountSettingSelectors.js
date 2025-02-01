import { flow, path } from 'lodash/fp';
import {
  GetAccountSettingAPI,
  UpdateAccountSettingAPI
} from '../apiCollections/accountSettingAPI';
import { createErrorSelector } from '../libs';

export const getAccountSettingDataSelector = flow(
  GetAccountSettingAPI.dataSelector,
  path('data.get_account_setting')
);

export const updateAccountSettingErrorMessageSelector = createErrorSelector(
  UpdateAccountSettingAPI
);

export const updateAccountSettingSuccessMessageSelector = flow(
  UpdateAccountSettingAPI.dataSelector,
  path('data.set_account_setting')
);
