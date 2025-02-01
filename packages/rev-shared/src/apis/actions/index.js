import * as AccountSettingActions from './accountSettingActions';
import * as TableActions from './tableActions';
import * as ProductActions from './productActions';
import * as PayAndSendActions from './payAndSendActions';
import * as DepositAddressActions from './depositAddressActions';
import * as PaymentActions from './paymentActions';
import * as OrderActions from './orderActions';
import * as UserActions from './userActions';
import * as PartnerActions from './partnerActions';
import * as WalletActions from './walletActions';

export default {
  ...AccountSettingActions,
  ...OrderActions,
  ...UserActions,
  ...PayAndSendActions,
  ...PaymentActions,
  ...DepositAddressActions,
  ...TableActions,
  ...ProductActions,
  ...PartnerActions,
  ...WalletActions
};
