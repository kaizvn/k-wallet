import { EWallets, Transactions, WalletAddresses } from '../services';
import { TRANSACTION_FINISHED } from '../graphql/enums/transactionStatus';
import { TYPE_TX_DEPOSIT } from '../graphql/enums/transactionType';
import { getCryptoLibByCoinId } from '../services/cryptoLibs';
import { sendCallback } from '../services/base';

const getUnprocessedTxsFromDB = () =>
  WalletAddresses.aggregate([
    { $unwind: '$deposit_transactions' },
    {
      $match: {
        'deposit_transactions.processed': 0
      }
    }
  ]);

const processNewTransactions = async () => {
  console.log('Start processing new transactions');

  const unprocessedTxs = await getUnprocessedTxsFromDB();

  for (let tx of unprocessedTxs) {
    try {
      const setCondition = { 'deposit_transactions.$.processed': 1 };

      const cryptoLib = getCryptoLibByCoinId(tx.coin_id);

      let [ewallet, rawTx, existedTransaction] = await Promise.all([
        EWallets.findOne({
          deposit_addresses: tx.address
        }),
        cryptoLib.getTransactionFromNetwork(tx.deposit_transactions.hash),
        Transactions.findOne({ hash: tx.deposit_transactions.hash })
      ]);

      if (!ewallet || !rawTx) {
        console.log('Cannot find ewallet or rawTx of: ', tx.address);
        continue;
      }

      const {
        totalAmount,
        amountInSmallestUnit,
        fee
      } = await cryptoLib.estimatedAmountAndFee({
        rawTx,
        senderAddress: tx.address
      });

      if (amountInSmallestUnit <= 0) {
        continue;
      }

      if (existedTransaction && !cryptoLib.isTransactionFinished(rawTx)) {
        continue;
      }

      if (!existedTransaction) {
        const walletAddress = await WalletAddresses.findOne({
          address: tx.address
        });

        existedTransaction = new Transactions({
          from_wallet_owner_id: cryptoLib.getFromAddresses(rawTx), //TODO: impelement getFromAddress
          coin_id: tx.coin_id,
          tracking_id: walletAddress.tracking_id,
          to_wallet_owner_id: ewallet.owner_id,
          hash: rawTx.hash,
          block_hash: rawTx.blockHash,
          type: TYPE_TX_DEPOSIT,
          amount: amountInSmallestUnit,
          total_amount: totalAmount,
          fee,
          received_address: tx.address,
          belong_to: ewallet.id
        });
      }

      if (cryptoLib.isTransactionFinished(rawTx)) {
        if (tx.deposit_transactions.internal_hash) {
          const internalTransferTx = await cryptoLib.getTransactionFromNetwork(
            tx.deposit_transactions.internal_hash
          );

          if (!cryptoLib.isTransactionFinished(internalTransferTx)) {
            continue;
          }
        } else {
          const internalHash = await cryptoLib.internalTransferToWithdrawWallet(
            {
              ewallet,
              fromAddress: tx.address,
              smallestUnitAmount: amountInSmallestUnit
            }
          );

          if (!internalHash && typeof internalHash !== 'string') {
            console.error('withdraw error!: ', internalHash);
            continue;
          }

          await existedTransaction.save();

          await WalletAddresses.updateOne(
            {
              'deposit_transactions.hash': rawTx.hash
            },
            {
              $set: {
                'deposit_transactions.$.internal_hash': internalHash
              }
            }
          );

          continue;
        } // end else has internal_hash
      } else {
        console.log('pending ETH transaction:', rawTx.hash);
        existedTransaction.save();
        continue;
      } // end else rawTx isFinished

      const session = await Transactions.startSession();

      await session
        .withTransaction(async () => {
          //update status of tx
          await WalletAddresses.updateOne(
            {
              'deposit_transactions.hash': rawTx.hash
            },
            {
              $set: setCondition
            },
            { session }
          );

          existedTransaction.status = TRANSACTION_FINISHED;
          await existedTransaction.save({ session });

          await EWallets.updateOne(
            {
              deposit_addresses: tx.address
            },
            {
              $inc: {
                balance: amountInSmallestUnit
              }
            },
            {
              session
            }
          );
        })
        .catch((error) => {
          console.log('session failed: ', error);
          throw error;
        });

      // TODO - handleCallbackResult
      return sendCallback({
        ownerId: ewallet.owner_id,
        txDetail: existedTransaction
      });
    } catch (e) {
      throw e;
    }
  } // end for
  console.log('End processing new transactions');
};

export default {
  name: 'Process New Transactions',
  interval: '30 */5 * * * *',
  handler: processNewTransactions
};
