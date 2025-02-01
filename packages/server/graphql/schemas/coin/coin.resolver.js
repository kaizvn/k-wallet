import { path } from 'lodash/fp';
import { COIN_ACTIVE, COIN_INACTIVE } from '../../enums/coinStatus';

export default {
  Coin: {
    minimumWithdrawal: (payload) => path('minimum_withdrawal')(payload) || 0,
    minimumDeposit: path('minimum_deposit') || 0,
    feePercentage: (payload) => path('fee_percentage')(payload) || 0,
    feeFixed: path('fee_fixed') || 0,
    marginPercentage: path('margin_percentage') || 0,
    isCompoundSupport: (payload) =>
      path('is_compound_support')(payload) || false,
    contractAddress: path('contract_address'),
    isPFSupport: path('is_pf_support'),
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  },
  CoinStatus: {
    ACTIVE: COIN_ACTIVE,
    INACTIVE: COIN_INACTIVE
  },
  UpdateCoinStatusAction: {
    ENABLE: COIN_ACTIVE,
    DISABLE: COIN_INACTIVE
  }
};
