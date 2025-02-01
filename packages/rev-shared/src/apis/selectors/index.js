import * as AccountSettingSelectors from './accountSettingSelectors';
import * as UserSelectors from './userSelectors';
import * as DepositAddressSelectors from './depositAddressSelectors';
import * as PaymentsSelectors from './paymentsSelectors';
import * as ProductSelectors from './productSelectors';
import * as TableSelectors from './tableSelectors';
import * as PayAndSendSelectors from './payAndSendSelectors';
import * as PartnerSelectors from './partnerSelectors';
import * as WalletSelectors from './walletSelectors';

export default {
  ...AccountSettingSelectors,
  ...UserSelectors,
  ...DepositAddressSelectors,
  ...PaymentsSelectors,
  ...ProductSelectors,
  ...TableSelectors,
  ...PayAndSendSelectors,
  ...PartnerSelectors,
  ...WalletSelectors
};
