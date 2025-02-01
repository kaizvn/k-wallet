import { get } from 'lodash/fp';

import { getGeneralTransferLimit } from './systemUser';
import Partners from '../models/partner';
import { findPartner } from '../utils';

const getTransferLimit = get('setting.limit_transfer');

export const getPartnerTransferLimit = async partnerId => {
  const partner = await findPartner({ partner_id: partnerId });
  const tranferLimit = getTransferLimit(partner);

  if (!tranferLimit) {
    return getGeneralTransferLimit();
  }

  return tranferLimit;
};
export default Partners;
