import { EVENT_TRANSACTION_FINISHED } from '../pubsub/events';
import { PubSub } from '../pubsub';
import { TRANSACTION_FINISHED } from '../graphql/enums/transactionStatus';
import { Transactions } from '../services';

const BC_CONFIRMATION_THRESHOLD =
  parseInt(process.env.BC_CONFIRMATION_THRESHOLD) || 3;

export const withdrawalWallet = async (req, res) => {
  try {
    const rawTx = req.body;

    if (
      rawTx.confirmations &&
      +rawTx.confirmations === BC_CONFIRMATION_THRESHOLD
    ) {
      //todo: update balance , update status of transaction , webhook
      const transaction = await Transactions.findOne({ hash: rawTx.hash });

      if (transaction) {
        transaction.status = TRANSACTION_FINISHED;
        transaction.save();
        PubSub.emit(EVENT_TRANSACTION_FINISHED, transaction);
      }
    }

    return res.send({ status: 'ok' });
  } catch (error) {
    console.log('withdraw error: ', error);
  }
};

export const withdrawERC20 = async (req, res) => {
  console.log('withdraw req:', req.params, req.body);
  try {
    const { hash, confirmations } = req.body;
    if (confirmations && +confirmations === BC_CONFIRMATION_THRESHOLD) {
      const transaction = await Transactions.findOne({ hash: hash });

      if (transaction) {
        transaction.status = TRANSACTION_FINISHED;
        transaction.save();
        PubSub.emit(EVENT_TRANSACTION_FINISHED, transaction);
      }
    }

    return res.send({ status: 'ok' });
  } catch (error) {
    console.log('withdraw ERC20 error: ', error);
  }
};
