import { sendCallback } from '../services/base';
import { createListenerCallback } from './utils';
import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';
import { findPartner } from '../utils';

const SEND_TRANSACTION_CALLBACK = 'Send Transaction Callback ';

export const sendTransactionCallback = createListenerCallback(
  SEND_TRANSACTION_CALLBACK,
  async (transaction = {}) => {
    let owner;
    if (transaction.type === TYPE_TX_DEPOSIT) {
      owner = await findPartner(transaction.to_wallet_owner_id);
    } else if (transaction.type === TYPE_TX_WITHDRAW) {
      owner = await findPartner(transaction.from_wallet_owner_id);
    }
    if (owner) {
      return sendCallback({
        ownerId: owner.id,
        txDetail: transaction
      });
    }
  }
);
