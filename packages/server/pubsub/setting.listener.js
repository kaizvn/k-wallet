import { addSettingsTo } from '../services/setting';
import { createListenerCallback } from './utils';
import { findPartner } from '../utils';
import { getGeneralTransferLimit } from '../services/systemUser';
import Partners from '../services/partner';

const UPDATE_PARTNER_TRANSFER_LIMIT = 'Update partner transfer limit';
const INIT_USER_ACCOUNT_SETTING = 'Initial setting for new user';
const INIT_PARTNER_SETTING = 'Initial setting for new partner';

export const updatePartnerTransferLimit = createListenerCallback(
  UPDATE_PARTNER_TRANSFER_LIMIT,
  async adminSetting => {
    const partners = await Partners.find({});

    for (let partner of partners) {
      if (partner.setting.limit_transfer > adminSetting.limit_transfer) {
        partner.setting.limit_transfer = adminSetting.limit_transfer;
        return await partner.save();
      }
    }
  }
);

export const initUserAccountSettings = createListenerCallback(
  INIT_USER_ACCOUNT_SETTING,
  async user => {
    await addSettingsTo(user);
  }
);

export const initPartnerSettings = createListenerCallback(
  INIT_PARTNER_SETTING,
  async partner => {
    const partnerAccount = await findPartner(partner.partner_id);
    const limit_transfer = await getGeneralTransferLimit();

    const settingData = {
      timezone: 'Europe/London',
      callback_url: '',
      limit_transfer,
      is_active: true
    };

    partnerAccount.setting = settingData;
    await partnerAccount.save();
  }
);
