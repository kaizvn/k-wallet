import {
  GetAccountSettingAPI,
  UpdateAccountSettingAPI
} from '../apiCollections/accountSettingAPI';
import { getResetter } from '../libs';

export const getAccountSettingAPIResetter = getResetter(GetAccountSettingAPI);

export const updateAccountSettingAPIResetter = getResetter(
  UpdateAccountSettingAPI
);
