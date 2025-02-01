import { P_ACTIVE } from '../../graphql/enums/partnerStatus';

export const MockPartner = {
  id: 'partner-123-edf',
  partner_id: 'revpartner',
  owner_id: 'powner-123-456',
  name: 'Sample Partner',
  phone: '0981690658',
  address: '52 Seaport Ave',
  email: 'hello@revpayment.com',
  status: P_ACTIVE
};

export const MockPartner1 = {
  id: 'partner-456-edf',
  partner_id: 'revpartner1',
  owner_id: 'powner-456-789',
  name: 'Sample Partner 1',
  phone: '0985609618',
  address: '52 Seaport Ave',
  email: 'hello@revpayment.com',
  status: P_ACTIVE
};
