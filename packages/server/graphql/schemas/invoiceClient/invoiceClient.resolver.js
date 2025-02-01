import { Partners } from '../../../services';
import { path } from 'lodash/fp';
export default {
  InvoiceClient: {
    owner: async (payload) => {
      const owner = await Partners.findOne({ id: payload.owner_id });
      return owner;
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  }
};
