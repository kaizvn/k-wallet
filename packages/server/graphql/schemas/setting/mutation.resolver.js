import { combineResolvers } from 'graphql-resolvers';
import mtz from 'moment-timezone';
import i18n from 'i18n';
import { defaults } from 'lodash/fp';
import { ADMIN_SETTING_UPDATED } from '../../../pubsub/events';
import {
  PARTNER_MEM_SETTINGS,
  PARTNER_SETTINGS,
  SYS_ADMIN_SETTINGS,
  USER_SETTINGS
} from '../../enums/settingTypes';
import {
  P_OWNER,
  USER,
  P_MEM,
  SYS_MOD,
  SYS_ADMIN
} from '../../enums/userRoles';
import { PubSub } from '../../../pubsub';
import { Settings, SystemUsers } from '../../../services';
import {
  checkAuthorization,
  checkTruePartnerOwnerOfPartnerId
} from '../../libs';
import { formatObject } from '../../libs/formatter';
import { getGeneralTransferLimit } from '../../../services/systemUser';
import { findUser } from '../../../utils';

//TODO: desgin hook as fast as you can to emit event user:create
export default {
  Mutation: {
    set_partner_setting: combineResolvers(
      checkAuthorization([P_OWNER]),
      checkTruePartnerOwnerOfPartnerId,
      async (
        _,
        {
          timezone,
          callbackUrl,
          partnerName,
          partnerDescription,
          transferLimit,
          serviceStatus
        },
        { currentPartner }
      ) => {
        if (transferLimit <= 0) {
          throw Error(i18n.__('setting.mutation.error.transfer_limit'));
        }
        callbackUrl = callbackUrl ? callbackUrl.trim() : '';

        if (timezone) {
          const testDate = new mtz.tz(timezone);
          if (!testDate.tz()) {
            throw Error(
              i18n.__('setting.mutation.error.invalid.timezone_partner')
            );
          }
        }

        const adminLimitTransferSetting = await getGeneralTransferLimit();

        if (transferLimit) {
          if (transferLimit > adminLimitTransferSetting) {
            throw new Error(
              i18n.__('setting.mutation.error.message') +
                adminLimitTransferSetting
            );
          }
        }

        const settingData = formatObject({
          timezone,
          callback_url: callbackUrl,
          limit_transfer: transferLimit,
          is_active: serviceStatus
        });

        currentPartner.setting = settingData;
        currentPartner.name = partnerName || currentPartner.name;
        currentPartner.description =
          partnerDescription || currentPartner.description;

        await currentPartner.save();
        return currentPartner.setting;
      }
    ),

    set_account_setting: combineResolvers(
      checkAuthorization([P_OWNER, USER, P_MEM, SYS_MOD, SYS_ADMIN]),
      async (_, { timezone, language }, { currentUser }) => {
        if (timezone) {
          const testDate = new mtz.tz(timezone);
          if (!testDate.tz()) {
            throw Error(
              i18n.__('setting.mutation.error.invalid.timezone_user')
            );
          }
        }

        let setting = await Settings.findOne({
          owner_id: currentUser.id
        });

        let type;
        switch (currentUser.role) {
          case P_MEM:
            type = PARTNER_MEM_SETTINGS;
            break;
          case P_OWNER:
            type = PARTNER_SETTINGS;
            break;
          case SYS_ADMIN:
            type = SYS_ADMIN_SETTINGS;
            break;
          default:
            type = USER_SETTINGS;
        }

        const settingData = formatObject({
          timezone,
          language,
          type
        });

        if (!setting) {
          settingData.owner_id = currentUser.id;
          setting = new Settings(settingData);
        } else {
          setting.updateDoc(settingData);
        }
        await setting.save();
        return setting;
      }
    ),

    set_general_setting: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (
        _,
        {
          homePageTitle,
          homePageDescription,
          serverStatus,
          transferLimit,
          maintenanceMessage
        },
        { currentUser }
      ) => {
        if (transferLimit <= 0) {
          throw Error(i18n.__('setting.mutation.error.transfer_limit'));
        }
        const admin = await findUser(currentUser.id, SystemUsers);

        const settingData = formatObject({
          homepage_title: homePageTitle,
          homepage_description: homePageDescription,
          is_server_active: serverStatus,
          limit_transfer: transferLimit,
          maintenance_message: maintenanceMessage
        });

        admin.setting = defaults(admin.setting)(settingData);
        await admin.save();
        PubSub.emit(ADMIN_SETTING_UPDATED, admin.setting);

        return admin.setting;
      }
    )
  }
};
