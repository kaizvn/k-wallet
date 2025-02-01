import { combineResolvers } from 'graphql-resolvers';

import { P_OWNER, SYS_ADMIN } from '../../enums/userRoles';
import {
  checkAuthorization,
  checkTruePartnerOwnerOfPartnerId,
  checkAuthentication
} from '../../libs';
import Settings from '../../../models/setting';
import SystemUsers, {
  getGeneralTransferLimit
} from '../../../services/systemUser';
import { findUser } from '../../../utils';

export default {
  Query: {
    get_partner_setting: combineResolvers(
      checkAuthorization([P_OWNER]),
      checkTruePartnerOwnerOfPartnerId,
      async (_, __, { currentPartner }) => currentPartner
    ),
    get_account_setting: combineResolvers(
      checkAuthentication,
      async (_, __, { currentUser }) => {
        let settings = await Settings.findOne({ owner_id: currentUser.id });

        if (!settings) {
          settings = new Settings({
            owner_id: currentUser.id
          });
          await settings.save();
        }

        return settings;
      }
    ),

    get_general_setting: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async () => {
        const admin = await findUser({ username: 'admin' }, SystemUsers);
        return admin.setting || {};
      }
    ),

    get_general_transfer_limit: combineResolvers(
      checkAuthorization([P_OWNER]),
      async () => {
        const generalTransferLimitSetting = await getGeneralTransferLimit();
        return { limit_transfer: generalTransferLimitSetting };
      }
    ),
    get_server_info: async () => {
      const admin = await findUser({ username: 'admin' }, SystemUsers);
      const { setting = {} } = admin || {};
      return {
        maintenanceMessage: setting.maintenance_message,
        serverStatus: setting.is_server_active
      };
    }
  }
};
