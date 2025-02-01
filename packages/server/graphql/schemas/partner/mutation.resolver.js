import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import { P_CANCELLED, P_PENDING } from '../../enums/partnerStatus';
import { Partners, Users } from '../../../services';
import { SYS_MOD } from '../../enums/userRoles';
import { U_CANCELLED } from '../../enums/userStatus';
import { checkAuthorization } from '../../libs';

export default {
  Mutation: {
    cancel_partner_invitation: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { id }) => {
        const partner = await Partners.findOne({ id, status: P_PENDING });

        if (!partner) {
          throw new Error(i18n.__('partner.mutation.error.not_found.partner'));
        }

        partner.status = P_CANCELLED;
        const owner = await Users.findOne({ id: partner.owner_id });

        if (owner) {
          owner.status = U_CANCELLED;
          owner.save();
        }

        await partner.save();

        return partner;
      }
    )
  }
};
