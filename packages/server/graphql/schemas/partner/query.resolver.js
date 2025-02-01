import { combineResolvers } from 'graphql-resolvers';
import { findPartner, findUser } from '../../../utils';
import { Partners, PartnerUsers } from '../../../services';
import { SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { sortDefaultOptions } from '../../libs/options';

module.exports = {
  Query: {
    get_partners: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      () => Partners.find().sort(sortDefaultOptions)
    ),

    get_partner: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      (_, { id }) => findPartner(id)
    ),
    get_current_partner: combineResolvers(
      checkAuthentication,
      async (_, __, { currentUser }) => {
        const user = await findUser(currentUser.id, PartnerUsers);
        return Partners.findOne({ id: user.partner_id });
      }
    ),
    // ???
    get_paid_partner: combineResolvers(
      checkAuthentication,
      (_, { id, partnerId }) =>
        findPartner({ $or: [{ id }, { partner_id: partnerId }] })
    )
  }
};
