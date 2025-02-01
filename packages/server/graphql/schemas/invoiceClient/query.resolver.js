import { combineResolvers } from 'graphql-resolvers';
import { InvoiceClients } from '../../../services';
import { formatFilter, getDataWithFilter } from '../../../utils';
import { P_OWNER } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';
import i18n from 'i18n';
module.exports = {
  Query: {
    get_quick_filter_invoices_client_by_owner_id: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { filter }, { currentPartner, currentUser }) => {
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
          collection: InvoiceClients,
          condition,
          options: formatedFilter
        });

        return { pageInfos, invoiceClients: data };
      }
    ),
    get_invoices_client_by_owner_id: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, __, { currentPartner }) => {
        const invoiceClients = await InvoiceClients.find({
          owner_id: currentPartner.id
        });
        return invoiceClients;
      }
    ),
    get_invoice_client: combineResolvers(
      checkAuthorization(P_OWNER),
      async (_, { id }) => {
        const invoiceClient = await InvoiceClients.findOne({
          id
        });
        if (!invoiceClient) {
          throw Error(i18n.__('invoice.client.not_found'));
        }
        return invoiceClient;
      }
    )
  }
};
