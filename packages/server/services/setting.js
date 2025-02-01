import {
  PARTNER_MEM_SETTINGS,
  PARTNER_SETTINGS,
  USER_SETTINGS
} from '../graphql/enums/settingTypes';
import { P_MEM, P_OWNER } from '../graphql/enums/userRoles';
import Settings from '../models/setting';

export const addSettingsTo = async userOrPartner => {
  let type;
  switch (userOrPartner.role) {
    case P_MEM:
      type = PARTNER_MEM_SETTINGS;
      break;
    case P_OWNER:
      type = PARTNER_SETTINGS;
      break;
    default:
      type = USER_SETTINGS;
  }

  const settings = new Settings({
    type,
    owner_id: userOrPartner.id,
    timezone: 'Europe/London',
    language: 'en'
  });

  await settings.save();
};

export default Settings;
