import { reducers as apiReducers } from 'redux-api-call';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import AdminState from './AdminState';
import NavigationState from './NavigationState';
import OrdersState from './OrdersState';
import PartnerState from './PartnerState';
import SettingState from './SettingState';
import TransactionState from './TransactionState';
import UserState from './UserState';
import WalletState from './WalletState';
import PaymentState from './PaymentState';
import ToastState from './ToastState';
import BillingState from './BillingState';

export default combineReducers({
  form: formReducer,
  ...UserState,
  ...apiReducers,
  ...NavigationState,
  ...WalletState,
  ...AdminState,
  ...PartnerState,
  ...SettingState,
  ...TransactionState,
  ...OrdersState,
  ...PaymentState,
  ...ToastState,
  ...BillingState
});
