import { MALE } from '../../graphql/enums/userGender';
import {
  P_MEM,
  P_OWNER,
  SYS_ADMIN,
  SYS_MOD
} from '../../graphql/enums/userRoles';
import { U_ACTIVE } from '../../graphql/enums/userStatus';

export const AdminAccount = {
  id: 'sys-123-xyz',
  username: 'admin',
  password: '123456',
  first_name: 'Admin',
  last_name: 'Account',
  role: SYS_ADMIN
};

export const ModAccount = {
  id: 'sys-467-abc',
  username: 'mod969',
  password: '123456',
  first_name: 'Moderator',
  last_name: 'Account',
  role: SYS_MOD,
  status: U_ACTIVE
};

export const PartnerOwnerAccount = {
  id: 'powner-123-456',
  username: 'powner123',
  first_name: 'Owner',
  last_name: 'Partner',
  password: '123456',
  title: 'Mr',
  gender: MALE,
  identity: '434998573',
  email: 'admin@revpartner.com',
  phone: '0981123456',
  country: 'United States',
  region: 'Maine',
  address: '52 Seaport Ave',
  mcc_code: '+1',
  zip_code: '04981',
  birth_date: '12/21/1980',
  partner_id: 'partner-123-edf',
  role: P_OWNER,
  status: U_ACTIVE
};

export const PartnerOwnerAccount1 = {
  id: 'powner-456-789',
  username: 'powner456',
  first_name: 'Owner',
  last_name: 'Partner 1',
  password: '123456',
  title: 'Mr',
  gender: MALE,
  identity: '375899434',
  email: 'admin@revpartner1.com',
  phone: '0654321189',
  country: 'United States',
  region: 'Maine',
  address: '52 Seaport Ave',
  mcc_code: '+1',
  zip_code: '04981',
  birth_date: '12/21/1980',
  partner_id: 'partner-456-edf',
  role: P_OWNER,
  status: U_ACTIVE
};

export const PartnerMemberAccount = {
  id: 'pmember-abc-xyz',
  username: 'pmember123',
  password: '123456',
  first_name: 'Member',
  last_name: 'Partner',
  title: 'Mr',
  gender: MALE,
  identity: '434998375',
  email: 'member@revpartner.com',
  phone: '0698112345',
  country: 'United States',
  region: 'Maine',
  address: '52 Seaport Ave',
  mcc_code: '+1',
  zip_code: '18940',
  birth_date: '03/18/1995',
  partner_id: 'partner-123-edf',
  role: P_MEM,
  status: U_ACTIVE
};

export const CustomerAccount = {
  id: 'user-123-456',
  username: 'user123',
  password: '123456',
  first_name: 'User',
  last_name: 'Test',
  gender: MALE,
  title: 'Mr',
  identity: '217654262',
  email: 'test_user@gmail.com',
  phone: '03161585676',
  country: 'Singapore',
  region: 'Singapore',
  address: '25 Carpmael Rd',
  mcc_code: '+65',
  zip_code: '54608',
  birth_date: '12/15/1990',
  status: U_ACTIVE
};

export const CustomerAccount1 = {
  id: 'user-456-789',
  username: 'user456',
  password: '123456',
  title: 'Mr',
  first_name: 'User',
  last_name: 'Test 1',
  gender: MALE,
  identity: '262456712',
  email: 'test_user1@gmail.com',
  phone: '03676585161',
  country: 'Singapore',
  region: 'Singapore',
  address: '26 Carpmael Rd',
  mcc_code: '+65',
  zip_code: '54608',
  birth_date: '12/16/1991',
  status: U_ACTIVE
};

export const UserAccountTestChangePass = {
  id: 'user-456-789-1011',
  username: 'user789',
  password: '123456',
  title: 'Mr',
  first_name: 'User',
  last_name: 'Test 1',
  gender: MALE,
  identity: '262456712',
  email: 'test_user_change_pass@gmail.com',
  phone: '03676585161',
  country: 'Singapore',
  region: 'Singapore',
  address: '26 Carpmael Rd',
  mcc_code: '+65',
  zip_code: '54608',
  birth_date: '12/16/1991',
  status: U_ACTIVE
};

export const PartnerAccountTestChangePass = {
  id: 'powner-111-222',
  username: 'powner111',
  first_name: 'Owner',
  last_name: 'Partner 111',
  password: '123456',
  title: 'Mr',
  gender: MALE,
  identity: '375899434',
  email: 'partnerAccountTestChangePass@revpartner.com',
  phone: '0654321181',
  country: 'United States',
  region: 'Maine',
  address: '52 Seaport Ave',
  mcc_code: '+1',
  zip_code: '04981',
  birth_date: '12/21/1980',
  partner_id: 'partner-456-edf',
  role: P_OWNER,
  status: U_ACTIVE
};

export const UserAccountTestResetPass = {
  id: 'user-456-789-1012',
  username: 'user890',
  password: '123456',
  title: 'Mr',
  first_name: 'User',
  last_name: 'Test 1',
  gender: MALE,
  identity: '262456712',
  email: 'test_user_reset_pass@gmail.com',
  phone: '03676585161',
  country: 'Singapore',
  region: 'Singapore',
  address: '26 Carpmael Rd',
  mcc_code: '+65',
  zip_code: '54608',
  birth_date: '12/16/1991',
  status: U_ACTIVE
};

export const PartnerAccountTestResetPass = {
  id: 'powner-789-1011',
  username: 'powner891',
  first_name: 'Owner',
  last_name: 'Partner 891',
  password: '123456',
  title: 'Mr',
  gender: MALE,
  identity: '375899434',
  email: 'test_partner_reset_pass@revpartner1.com',
  phone: '0654321189',
  country: 'United States',
  region: 'Maine',
  address: '52 Seaport Ave',
  mcc_code: '+1',
  zip_code: '04981',
  birth_date: '12/21/1980',
  partner_id: 'partner-456-edf',
  role: P_OWNER,
  status: U_ACTIVE
};
