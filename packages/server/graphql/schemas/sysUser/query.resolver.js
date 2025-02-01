import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import { P_OWNER, SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import {
  PartnerUsers,
  SystemUsers,
  Partners,
  Users,
  Coins
} from '../../../services';
import { checkAuthorization } from '../../libs';
import { sortDefaultOptions } from '../../libs/options';
import { findUser, getDataWithFilter, formatFilter } from '../../../utils';

module.exports = {
  Query: {
    get_quick_filter_partners: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        const condition = formatedFilter.filterContents
          ? { $text: { $search: formatedFilter.filterContents } }
          : {};

        const { pageInfos, data } = await getDataWithFilter({
          collection: Partners,
          condition,
          options: formatedFilter
        });
        return { pageInfos, partners: data };
      }
    ),
    login_system_user: async (_, { username, password }) => {
      username = username.toLowerCase();

      const user = await findUser({ username }, SystemUsers);
      if (user) {
        if (await user.comparePassword(password)) {
          return user;
        }
      }
      throw new Error(i18n.__('sysUser.query.error.incorrect.login'));
    },
    get_system_users: combineResolvers(checkAuthorization([SYS_ADMIN]), () => {
      return SystemUsers.find().sort(sortDefaultOptions);
    }),
    get_system_user: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      (_, { id }) => SystemUsers.findOne({ id })
    ),
    get_partner_users: combineResolvers(checkAuthorization([SYS_ADMIN]), () =>
      PartnerUsers.find()
    ),
    get_quick_filter_partner_users: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        const condition = formatedFilter.filterContents
          ? { $text: { $search: formatedFilter.filterContents } }
          : {};

        const { pageInfos, data } = await getDataWithFilter({
          collection: PartnerUsers,
          condition,
          options: formatedFilter
        });
        return { pageInfos, partnerUsers: data };
      }
    ),
    get_partner_user: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      (_, { id }) => PartnerUsers.findOne({ id: id })
    ),
    get_partner_owners: combineResolvers(checkAuthorization([SYS_ADMIN]), () =>
      PartnerUsers.find({
        role: P_OWNER
      }).sort(sortDefaultOptions)
    ),

    get_quick_filter_users: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        const condition = formatedFilter.filterContents
          ? { $text: { $search: formatedFilter.filterContents } }
          : {};

        const { pageInfos, data } = await getDataWithFilter({
          collection: Users,
          condition,
          options: formatedFilter
        });
        return { pageInfos, users: data };
      }
    ),
    get_quick_filter_moderators: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        const condition = formatedFilter.filterContents
          ? {
              $text: { $search: formatedFilter.filterContents },
              role: { $ne: SYS_ADMIN }
            }
          : { role: { $ne: SYS_ADMIN } };

        const { pageInfos, data } = await getDataWithFilter({
          collection: SystemUsers,
          condition,
          options: formatedFilter
        });
        return { pageInfos, users: data };
      }
    ),
    get_quick_filter_coins: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      async (_, { filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        const condition = formatedFilter.filterContents
          ? { $text: { $search: formatedFilter.filterContents } }
          : {};

        const { pageInfos, data } = await getDataWithFilter({
          collection: Coins,
          condition,
          options: formatedFilter
        });
        return { pageInfos, coins: data };
      }
    )
  }
};
