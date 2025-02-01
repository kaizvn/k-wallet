import { saveLanguage, getLanguage, saveTimezone } from '../../libs';
import { respondToSuccess } from '../libs';
import { i18n } from '../../i18n';
import {
  GetAccountSettingAPI,
  UpdateAccountSettingAPI
} from '../apiCollections/accountSettingAPI';
import { CHANGE_LANGUAGE } from '../names';
import { parseBoolean } from '../../utils';

export const getAccountSetting = callback =>
  respondToSuccess(GetAccountSettingAPI.actionCreator({}), (resp, _, store) => {
    if (resp.errors) {
      console.error(resp.errors);
      return;
    }

    typeof callback === 'function' && callback(store.dispatch);

    saveTimezone(resp.data.get_account_setting.timezone);
    saveLanguage(resp.data.get_account_setting.language);
    const currentLanguage = parseBoolean(getLanguage())
      ? getLanguage()
      : i18n.options.defaultLanguage;
    i18n.changeLanguage(currentLanguage);
    store.dispatch({
      type: CHANGE_LANGUAGE,
      payload: {
        symbol: currentLanguage
      }
    });
    return;
  });

export const updateAccountSetting = ({ timezone, language }, callback) =>
  respondToSuccess(
    UpdateAccountSettingAPI.actionCreator({
      language,
      timezone
    }),
    (resp, headers, store) => {
      if (resp.error) {
        console.error(resp.error);
        return;
      }

      typeof callback === 'function' && callback(store.dispatch);

      saveTimezone(resp.data.set_account_setting.timezone);
      saveLanguage(resp.data.set_account_setting.language);
      const currentLanguage = parseBoolean(getLanguage())
        ? getLanguage()
        : i18n.options.defaultLanguage;
      i18n.changeLanguage(currentLanguage);
      store.dispatch({
        type: CHANGE_LANGUAGE,
        payload: {
          symbol: currentLanguage
        }
      });
      return;
    }
  );
