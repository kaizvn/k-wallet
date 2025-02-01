import { path } from 'lodash/fp';

import { Base, Coins, Bills, Partners, Users } from '../../../services';
import {
  TRANSACTION_CANCELLED,
  TRANSACTION_FAILED,
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_REVERTED,
  TRANSACTION_PENDING_ADMIN_APPROVAL,
  TRANSACTION_PENDING_PARTNER_APPROVAL,
  TRANSACTION_MANUAL_ADMIN
} from '../../enums/transactionStatus';
import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_TRANSFER,
  TYPE_TX_WITHDRAW
} from '../../enums/transactionType';
import { formatEtherAddress } from '../../../utils/bcUtils';
import { isEtherCurrency } from '../../../services/base';
import { SYS_ADMIN } from '../../enums/userRoles';

export default {
  Transaction: {
    bill: (tx) => Bills.findOne({ transaction_id: tx.id }),
    from: async (tx) => {
      if (tx.type === TYPE_TX_DEPOSIT) {
        return { address: tx.from_wallet_owner_id || 'Multi Wallet Addresses' };
      } else if (tx.type === TYPE_TX_WITHDRAW || tx.type === TYPE_TX_TRANSFER) {
        const owner =
          (await Partners.findOne({ id: tx.from_wallet_owner_id })) ||
          (await Users.findOne({ id: tx.from_wallet_owner_id }));
        return owner;
      }
    },

    to: async (tx) => {
      if (tx.type === TYPE_TX_WITHDRAW) {
        return { address: tx.to_wallet_owner_id };
      } else if (tx.type === TYPE_TX_DEPOSIT || tx.type === TYPE_TX_TRANSFER) {
        const owner =
          (await Partners.findOne({ id: tx.to_wallet_owner_id })) ||
          (await Users.findOne({ id: tx.to_wallet_owner_id }));
        return owner;
      }
    },

    coin: (tx) => Coins.findOne({ id: tx.coin_id }),
    amount: async (transaction) =>
      Base.convertToPrimaryUnitForDisplay({
        coinId: transaction.coin_id,
        amount: transaction.amount
      }),
    fee: async (transaction) =>
      Base.convertToPrimaryUnitForDisplay({
        coinId: transaction.coin_id,
        amount: transaction.fee
      }),
    hashUrl: (transaction) =>
      Base.getHashUrl({ coinId: transaction.coin_id, hash: transaction.hash }),
    createdAt: path('created_at'),
    updatedAt: path('updated_at'),
    status: (tx, args, { currentUser = {} }) => {
      if (
        tx.status === TRANSACTION_MANUAL_ADMIN &&
        currentUser.role !== SYS_ADMIN
      ) {
        return TRANSACTION_PENDING;
      }
      return tx.status;
    },
    trackingId: (transaction) => transaction.tracking_id,
    receivedAddress: (tx) => {
      const isEther = isEtherCurrency(tx.coin_id);

      return isEther
        ? formatEtherAddress(tx.received_address)
        : tx.received_address;
    }
  },

  TransactionStatus: {
    FAILED: TRANSACTION_FAILED,
    PENDING: TRANSACTION_PENDING,
    FINISHED: TRANSACTION_FINISHED,
    CANCELLED: TRANSACTION_CANCELLED,
    REJECTED: TRANSACTION_REJECTED,
    REVERTED: TRANSACTION_REVERTED,
    PENDING_ADMIN_APPROVAL: TRANSACTION_PENDING_ADMIN_APPROVAL,
    PENDING_PARTNER_APPROVAL: TRANSACTION_PENDING_PARTNER_APPROVAL,
    MANUAL_ADMIN: TRANSACTION_MANUAL_ADMIN
  },

  TransactionType: {
    DEPOSIT: TYPE_TX_DEPOSIT,
    WITHDRAW: TYPE_TX_WITHDRAW,
    TRANSFER: TYPE_TX_TRANSFER
  },

  Fee: {
    coinID: path('id'),
    coinName: path('name'),
    minimumAmount: path('minimum_withdrawal'),
    percentageFee: path('fee_percentage'),
    fixedFee: path('fee_fixed')
  }
};
