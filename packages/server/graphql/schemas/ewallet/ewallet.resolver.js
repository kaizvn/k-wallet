import { path } from 'lodash/fp';
import { checkAuthorization } from '../../libs';

import { Coins, Base, Partners, Users, SystemUsers } from '../../../services';
import { WALLET_PARTNER, WALLET_USER } from '../../enums/walletType';
import { SYS_MOD } from '../../enums/userRoles';

export default {
  EWallet: {
    owner: (wallet) => {
      switch (wallet.type) {
        case WALLET_PARTNER:
          return Partners.findOne({ id: wallet.owner_id });
        case WALLET_USER:
          return Users.findOne({ id: wallet.owner_id });
        default:
          return SystemUsers.findOne({ id: wallet.owner_id });
      }
    },
    balance: (wallet) =>
      Base.convertToPrimaryUnitForDisplay({
        coinId: wallet.coin_id,
        amount: wallet.balance
      }),
    lockedBalance: (wallet) =>
      Base.convertToPrimaryUnitForDisplay({
        coinId: wallet.coin_id,
        amount: wallet.locked_balance
      }),
    extraAmount: (wallet) => path('extra_amount')(wallet) || 0,
    coin: (wallet) => Coins.findOne({ id: wallet.coin_id }),
    createdAt: path('created_at'),
    updatedAt: path('updated_at'),
    receivingAddress: (parent, args, { currentUser }) => {
      const error = checkAuthorization(SYS_MOD)(parent, args, {
        currentUser
      });

      return error ? null : path('receiving_address')(parent);
    },
    isSynchronizing: path('is_synchronizing')
  },
  WalletType: {
    WALLET_USER,
    WALLET_PARTNER
  },
  EWalletOwner: {
    __resolveType: (object) => {
      switch (true) {
        case !!object.owner_id:
          return 'Partner';
        case !!object.username:
          return 'User';
        default:
          return 'OutsiderWallet';
      }
    }
  },
  DepositAddressResp: {
    coin: ({ coinId }) => Coins.findOne({ id: coinId })
  }
};
