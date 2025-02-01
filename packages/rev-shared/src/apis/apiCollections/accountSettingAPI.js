import { makeFetchAction } from 'redux-api-call';
import { GET_ACCOUNT_SETTING_API, UPDATE_ACCOUNT_SETTING_API } from '../names';
import { gql } from '../../libs';

export const GetAccountSettingAPI = makeFetchAction(
  GET_ACCOUNT_SETTING_API,
  gql`
    query {
      get_account_setting {
        timezone
        language
      }
    }
  `
);

export const UpdateAccountSettingAPI = makeFetchAction(
  UPDATE_ACCOUNT_SETTING_API,
  gql`
    mutation($timezone: String, $language: String) {
      set_account_setting(timezone: $timezone, language: $language) {
        id
        timezone
        language
      }
    }
  `
);
