import * as AccountSettingResetters from './accountSettingResetters';
import * as DepositAddressResetters from './depositAddressResetters';
import * as UserResetters from './userResetters';
import * as PaymentResetters from './paymentResetters';

export default {
  ...AccountSettingResetters,
  ...DepositAddressResetters,
  ...UserResetters,
  ...PaymentResetters
};
