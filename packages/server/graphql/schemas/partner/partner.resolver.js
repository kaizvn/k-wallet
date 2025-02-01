import { path } from 'lodash/fp';
import {
  P_ACTIVE,
  P_PENDING,
  P_REJECTED,
  P_SUSPENDED,
  P_CANCELLED,
  P_BANNED
} from '../../enums/partnerStatus';
import { PartnerUsers } from '../../../services';

module.exports = {
  PartnerStatus: {
    REJECTED: P_REJECTED,
    PENDING: P_PENDING,
    ACTIVE: P_ACTIVE,
    SUSPENDED: P_SUSPENDED,
    CANCELLED: P_CANCELLED,
    BANNED: P_BANNED
  },

  Partner: {
    owner: partner => {
      return PartnerUsers.findOne({ id: partner.owner_id });
    },
    partnerId: path('partner_id'),
    members: partner => {
      return PartnerUsers.find({ partner_id: partner.id });
    },
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  },

  PaidPartner: {
    partnerId: path('partner_id')
  }
};
