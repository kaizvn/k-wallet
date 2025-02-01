import { combineResolvers } from 'graphql-resolvers';
import { sortBy } from 'lodash/fp';
import i18n from 'i18n';
import {
  findUsersOfPartner,
  getDataWithFilter,
  formatFilter
} from '../../../utils';
import { P_OWNER } from '../../enums/userRoles';
import { PartnerUsers } from '../../../services';
import { U_ACTIVE, U_BANNED, U_PENDING } from '../../enums/userStatus';
import {
  checkAuthorization,
  checkTruePartnerOwnerOfMemberId,
  checkTruePartnerOwnerOfPartnerId
} from '../../libs';
import { sortDefaultOptions } from '../../libs/options';

module.exports = {
  Query: {
    login_partner_user: async (_, { username, password }) => {
      username = username.toLowerCase();

      const user = await PartnerUsers.findOne({ username });

      if (user) {
        if (user.status === U_BANNED) {
          throw new Error(i18n.__('partnerUser.query.error.action.banned'));
        }

        if (user.status === U_PENDING) {
          throw new Error(
            i18n.__('partnerUser.query.error.action.pending_approval')
          );
        }

        if (
          user.status === U_ACTIVE &&
          (await user.comparePassword(password))
        ) {
          return user;
        }
      }

      throw new Error(i18n.__('partnerUser.query.error.incorrect.login'));
    },
    get_quick_filter_partner_members: combineResolvers(
      checkAuthorization(P_OWNER),
      checkTruePartnerOwnerOfPartnerId,
      async (_, { filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);
        const partner_id = currentUser.partner_id;

        const condition = formatedFilter.filterContents
          ? {
              $and: [
                { partner_id },
                { $text: { $search: formatedFilter.filterContents } }
              ]
            }
          : { partner_id };

        const { pageInfos, data } = await getDataWithFilter({
          collection: PartnerUsers,
          condition,
          options: formatedFilter
        });
        return { pageInfos, partnerUsers: data };
      }
    ),
    get_partner_members: combineResolvers(
      checkAuthorization(P_OWNER),
      checkTruePartnerOwnerOfPartnerId,
      async (_, { partnerId }, { currentUser }) => {
        const partner_id = partnerId || currentUser.partner_id;

        if (!partner_id) {
          throw new Error(i18n.__('partnerUser.query.error.not_found.partner'));
        }

        const usersOfPartners = await findUsersOfPartner({
          partner_id
        });

        return sortBy(sortDefaultOptions)(usersOfPartners);
      }
    ),
    get_partner_member: combineResolvers(
      checkAuthorization(P_OWNER),
      checkTruePartnerOwnerOfMemberId,
      async (_, { id }) => {
        return await PartnerUsers.findOne({ id });
      }
    )
  }
};
