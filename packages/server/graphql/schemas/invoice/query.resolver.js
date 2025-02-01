import { combineResolvers } from 'graphql-resolvers';
import { Invoices } from '../../../services';
import { P_OWNER } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';
import { getDataWithFilter, formatFilter } from '../../../utils';

module.exports = {
  Query: {
    get_quick_filter_invoices: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { filter }, { currentUser, currentPartner }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        let condition = {
          owner_id: currentPartner.id
        };

        if (formatedFilter.filterContents) {
          condition = {
            $and: [
              { owner_id: currentPartner.id },
              { $text: { $search: formatedFilter.filterContents } }
            ]
          };
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: Invoices,
          condition,
          options: formatedFilter
        });

        return { pageInfos, invoices: data };
      }
    ),
    get_invoice: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { id }) => {
        const invoice = await Invoices.findOne({ id });
        return invoice;
      }
    )
  }
};
