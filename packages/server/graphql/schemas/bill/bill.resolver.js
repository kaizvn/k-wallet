import { path } from 'lodash/fp';
import { Base, Coins, Transactions, Partners, Users } from '../../../services';
import { BILL_DEPOSIT, BILL_WITHDRAW } from '../../enums/billType';
import {
  BILL_FAILED,
  BILL_EXPIRED,
  BILL_PENDING,
  BILL_CREATED,
  BILL_PAID,
  BILL_HOLD,
  BILL_CLOSED,
  BILL_NOT_ENOUGH_FUND,
  BILL_CONFIRMED
} from '../../enums/billStatus';

module.exports = {
  Bill: {
    owner: async bill =>
      (await Partners.findOne({ id: bill.owner_id })) ||
      (await Users.findOne({ id: bill.owner_id })),
    trackingId: path('tracking_id'),
    coin: bill => Coins.findOne({ id: bill.coin_id }),
    amount: bill =>
      Base.convertToPrimaryUnitForDisplay({
        coinId: bill.coin_id,
        amount: bill.amount
      }),
    actualAmount: bill =>
      Base.convertToPrimaryUnitForDisplay({
        coinId: bill.coin_id,
        amount: bill.actual_amount
      }),
    transaction: bill => Transactions.findOne({ id: bill.transaction_id }),
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  },

  BillStatus: {
    FAILED: BILL_FAILED,
    EXPIRED: BILL_EXPIRED,
    PENDING: BILL_PENDING,
    CREATED: BILL_CREATED,
    PAID: BILL_PAID,
    HOLD: BILL_HOLD,
    CLOSED: BILL_CLOSED,
    NOT_ENOUGH_FUND: BILL_NOT_ENOUGH_FUND,
    CONFIRMED: BILL_CONFIRMED
  },
  BillType: {
    BILL_DEPOSIT,
    BILL_WITHDRAW
  }
};
