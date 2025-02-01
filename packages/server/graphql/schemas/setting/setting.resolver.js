import { path } from 'lodash/fp';
import { combineResolvers } from 'graphql-resolvers';

import { SYS_ADMIN } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';

module.exports = {
  PartnerSetting: {
    timezone: path('setting.timezone'),
    language: path('setting.language'),
    callbackUrl: path('setting.callback_url'),
    partnerName: path('name'),
    partnerDescription: path('description'),
    transferLimit: path('setting.limit_transfer'),
    serviceStatus: path('setting.is_active')
  },

  UserSetting: {
    userId: path('owner_id')
  },

  GeneralSetting: {
    homePageTitle: path('homepage_title'),
    homePageDescription: path('homepage_description'),
    serverStatus: path('is_server_active'),
    transferLimit: path('limit_transfer'),
    maintenanceMessage: path('maintenance_message'),
    masterWallet: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      () => process.env.MASTER_WALLET_ADDRESS || 'unset'
    )
  },

  TransferLimit: {
    transferLimit: path('limit_transfer')
  }
};
