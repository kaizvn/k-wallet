import {
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING
} from '../graphql/enums/transactionStatus';
import { TYPE_TX_WITHDRAW } from '../graphql/enums/transactionType';
import { Transactions } from '../services';
import { getCryptoLibByCoinId } from '../services/cryptoLibs';
import { sendCallback } from '../services/base';

const getWithdrawalPendingTransaction = () =>
  Transactions.find(
    {
      status: TRANSACTION_PENDING,
      type: TYPE_TX_WITHDRAW
    },
    { id: 1, hash: 1, status: 1, coin_id: 1, from_wallet_owner_id: 1 }
  );

const processWithdrawTransactions = async () => {
  const withdrawPendingTransactions = await getWithdrawalPendingTransaction();

  const res = await Promise.all(
    withdrawPendingTransactions.map(async (tx) => {
      if (!tx.hash) {
        return;
      }

      try {
        const cryptoLib = getCryptoLibByCoinId(tx.coin_id);
        const txByHash = await cryptoLib.getTransactionFromNetwork(tx.hash);

        if (cryptoLib.isTransactionFinished(txByHash)) {
          tx.status = TRANSACTION_FINISHED;
          await tx.save();

          return sendCallback({
            ownerId: tx.from_wallet_owner_id,
            txDetail: tx
          });
        }
      } catch (error) {
        return error;
      }
    })
  );

  return res;
};

export default {
  name: 'Process Withdrawal Transactions',
  interval: '45 */5 * * * *',
  handler: processWithdrawTransactions
};
