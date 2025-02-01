import { combineResolvers } from 'graphql-resolvers';

import { Bills } from '../../../services';
import { P_OWNER } from '../../enums/userRoles';
import {
  checkAuthorization,
  checkTruePartnerOwnerOfPartnerId,
  checkAuthentication
} from '../../libs';
import { SYS_MOD } from '../../enums/userRoles';
import { sortDefaultOptions } from '../../libs/options';
import { BILL_PAID, BILL_PENDING } from '../../enums/billStatus';
import {
  getDataWithFilter,
  formatFilter,
  findAllUserIdAndPartnerId
} from '../../../utils';

module.exports = {
  Query: {
    get_bills: combineResolvers(
      checkAuthorization(P_OWNER),
      checkTruePartnerOwnerOfPartnerId,
      () => Bills.find().sort(sortDefaultOptions)
    ),

    get_bill: combineResolvers(
      checkAuthorization(P_OWNER),
      checkTruePartnerOwnerOfPartnerId,
      (_, { id }) => {
        return Bills.findOne({ id });
      }
    ),

    get_required_approval_bills: combineResolvers(
      checkAuthorization(SYS_MOD),
      async () => Bills.find({ status: BILL_PAID }).sort(sortDefaultOptions)
    ),

    get_withdraw_requests: combineResolvers(checkAuthorization(SYS_MOD), () =>
      Bills.find({ status: BILL_PENDING })
    ),
    get_quick_filter_bills: combineResolvers(
      checkAuthentication,
      async (_, { filter }, { currentUser, currentPartner }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);
        const ownerId = (currentPartner || currentUser).id;
        const condition = {};

        let arrId = [];
        if (formatedFilter.filterContents) {
          arrId = await findAllUserIdAndPartnerId({
            $text: { $search: formatedFilter.filterContents }
          });
          condition['$or'] = [
            { owner_id: { $in: arrId } },
            { address: { $in: arrId } }
          ];
        }

        const notAuthorized = checkAuthorization(SYS_MOD)(_, null, {
          currentUser
        });
        if (notAuthorized) {
          condition['owner_id'] = ownerId;
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: Bills,
          condition,
          options: formatedFilter
        });
        return { pageInfos, bills: data };
      }
    )
  }
};
