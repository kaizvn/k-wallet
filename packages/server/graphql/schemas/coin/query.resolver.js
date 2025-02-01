import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';

import { Coins } from '../../../services';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { getAvailableCoins } from '../../../services/cryptoLibs';
import { SYS_MOD } from '../../enums/userRoles';

export default {
  Query: {
    get_coin: combineResolvers(checkAuthentication, async (_, { id }) => {
      const coin = await Coins.findOne({ id });
      return coin ? coin : new Error(i18n.__('coin.query.error.not_found'));
    }),
    get_all_coins: combineResolvers(
      checkAuthentication,
      async (_, { availableOnly = true }, { currentUser }) => {
        if (availableOnly) {
          const availableCoins = getAvailableCoins();
          return Coins.find({ id: { $in: availableCoins } });
        }

        const isNotAuthorized = checkAuthorization(SYS_MOD)(
          _,
          {},
          { currentUser }
        );
        if (!!isNotAuthorized) throw isNotAuthorized;

        return Coins.find({});
      }
    )
  }
};
