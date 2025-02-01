import dotenv from 'dotenv';

import {
  AdminAccount,
  CustomerAccount,
  ModAccount,
  PartnerMemberAccount,
  PartnerOwnerAccount,
  UserAccountTestChangePass,
  UserAccountTestResetPass,
  PartnerAccountTestResetPass,
  AdminAccountTestResetPass
} from './__mocks__/userAccounts';
import { MockPartner, MockPartner1 } from './__mocks__/partners';

dotenv.config({ path: './test/.env' });

export const ACCOUNT_TYPE = {
  ADMIN: 1,
  MODERATOR: 2,
  OWNER: 3,
  MEMBER: 4,
  USER: 5,
  USER_TEST_CHANGEPASS: 8,
  OWNER_123: 6,
  OWNER_456: 7,
  PARTNER_TEST_CHANGEPASS: 9,
  USER_TEST_RESETPASS: 10,
  PARTNER_TEST_RESETPASS: 11,
  ADMIN_TEST_RESETPASS: 12
};

export const BASE_CTX = {
  req: { session: {} },
  res: {}
};

const getMockCtxByType = type => {
  if (!type) {
    return {};
  }

  switch (type) {
    case ACCOUNT_TYPE.ADMIN:
      return { currentUser: AdminAccount };
    case ACCOUNT_TYPE.MODERATOR:
      return { currentUser: ModAccount };
    case ACCOUNT_TYPE.OWNER:
      return { currentUser: PartnerOwnerAccount, currentPartner: MockPartner };
    case ACCOUNT_TYPE.OWNER_123:
      return { currentUser: PartnerOwnerAccount, currentPartner: MockPartner };
    case ACCOUNT_TYPE.OWNER_456:
      return { currentUser: PartnerOwnerAccount, currentPartner: MockPartner1 };
    case ACCOUNT_TYPE.MEMBER:
      return { currentUser: PartnerMemberAccount, currentPartner: MockPartner };
    case ACCOUNT_TYPE.USER_TEST_CHANGEPASS:
      return { currentUser: UserAccountTestChangePass };
    case ACCOUNT_TYPE.USER_TEST_RESETPASS:
      return { currentUser: UserAccountTestResetPass };
    case ACCOUNT_TYPE.PARTNER_TEST_RESETPASS:
      return { currentUser: PartnerAccountTestResetPass };
    case ACCOUNT_TYPE.ADMIN_TEST_RESETPASS:
      return { currentUser: AdminAccountTestResetPass };
    case ACCOUNT_TYPE.USER:
    default:
      return { currentUser: CustomerAccount };
  }
};

export default async type => {
  const dbs = await require('../db');
  const ctx = Object.assign({}, BASE_CTX, getMockCtxByType(type));

  return { dbs, ...ctx };
};
