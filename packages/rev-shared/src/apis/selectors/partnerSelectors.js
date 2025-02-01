import { flow, get } from 'lodash/fp';
import {
  GetPaidPartnerDetailsAPI,
  GetMemberListAPI,
  GetPartnerMemberDetailsAPI
} from '../apiCollections/partnerAPI';
import { createErrorSelector } from '../libs';

export const getPaidPartnerDetailsSelector = flow(
  GetPaidPartnerDetailsAPI.dataSelector,
  get('data.get_paid_partner')
);

export const partnerMembersSelector = flow(
  GetMemberListAPI.dataSelector,
  get('data.get_partner_members')
);

export const partnerMembersErrorSelector = createErrorSelector(
  GetMemberListAPI
);

export const getPartnerMemberDetailsSelector = flow(
  GetPartnerMemberDetailsAPI.dataSelector,
  get('data.get_partner_member')
);
