import { EWallets, Transactions } from '../services';
import {
  EVENT_TRANSACTION_CREATED,
  EVENT_TRANSACTION_FINISHED
} from '../pubsub/events';
import { PubSub } from '../pubsub';
import {
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING
} from '../graphql/enums/transactionStatus';
import { TYPE_TX_DEPOSIT } from '../graphql/enums/transactionType';
import {
  convertToPrimaryUnitForTx,
  getCoinConfigsOfTxType,
  getDepositAddressInfo,
  getSystemFee
} from '../services/base';
import { getCryptoLibExistsByCoinId } from '../services/cryptoLibs';
import { getDepositDataOfAddress } from '../utils/bcUtils';

const BC_CONFIRMATION_THRESHOLD =
  parseInt(process.env.BC_CONFIRMATION_THRESHOLD) || 3;

export const depositWalletPF = async (req, res) => {
  const rawTx = req.body;
  const { coinId, trackingId } = req.params;
  try {
    // 1st event of forwards: forwarding to destination
    if (rawTx.transaction_hash) {
      const cryptoLib = getCryptoLibExistsByCoinId(coinId);

      const ewallet = await EWallets.findOne({
        receiving_address: rawTx.destination
      });

      if (!ewallet) {
        return res.json({
          message: 'wallet does not exist'
        });
      }

      const forwardTx = await cryptoLib.getTxDetails(rawTx.transaction_hash);

      const amountInSmallestUnit = rawTx.value + (forwardTx.fees || 0);

      const { minimumDeposit } = await getCoinConfigsOfTxType(coinId);

      if (
        amountInSmallestUnit <
        convertToPrimaryUnitForTx({ coinId, amount: minimumDeposit })
      ) {
        console.log(
          'Amount is small than minimum deposit: ',
          rawTx.transaction_hash
        );

        return res.json({ message: 'Amount is small than minimum deposit' });
      }

      const systemFeeInfo = await getSystemFee({
        coinId,
        amountInSmallestUnit
      });

      const depositAmount = amountInSmallestUnit - systemFeeInfo.systemFee;

      const transaction = new Transactions({
        coin_id: coinId,
        tracking_id: trackingId,
        to_wallet_owner_id: ewallet.owner_id,
        hash: rawTx.input_transaction_hash,
        internal_hash: rawTx.transaction_hash,
        type: TYPE_TX_DEPOSIT,
        amount: depositAmount, //smallest unit
        original_amount: amountInSmallestUnit,
        fee: systemFeeInfo.systemFee,
        fee_network: forwardTx.fees,
        extra_amount: systemFeeInfo.systemFee - forwardTx.fees,
        fee_percentage: systemFeeInfo.percentage,
        received_address: rawTx.input_address,
        destination: rawTx.destination,
        belong_to: ewallet.id
      });

      await transaction.save();

      PubSub.emit(EVENT_TRANSACTION_CREATED, transaction);
    }

    //tx done
    else if (rawTx.confirmations >= BC_CONFIRMATION_THRESHOLD) {
      let transaction = await Transactions.findOne({
        internal_hash: rawTx.hash
      });

      if (!transaction) {
        transaction = await Transactions.findOne({
          hash: rawTx.hash,
          internal_hash: { $exists: false }
        });
      }

      if (transaction && transaction.internal_status === TRANSACTION_FINISHED) {
        transaction.status = TRANSACTION_FINISHED;
        transaction.internal_status = TRANSACTION_FINISHED;
        await transaction.save();

        PubSub.emit(EVENT_TRANSACTION_FINISHED, transaction);
      }
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Deposit PF error : ', error);
    return res.json({ status: 'not ok' });
  }
};

export const depositWalletNoPF = async (req, res) => {
  //todo :
  // when new txc come : check if hash or internal_hash exist yet :
  //   - no : new Tx
  //   - yes:  is it hash
  //               - yes : watch until reach threshhold ?
  //                      yes: update status to finish , => create new forward_tx => save internal_hash, network_fee, extra_fee
  //                      no: res.send({ok})
  //               - no : it is internal_hash => update internal_status: pending. if reach threshhold:
  //                                              - yes : update internal_status of tx: finish
  try {
    const rawTx = req.body;
    const { coinId, trackingId } = req.params;

    const cryptoLib = getCryptoLibExistsByCoinId(coinId, true);

    const transaction = await Transactions.findOne({
      $or: [{ hash: rawTx.hash }, { internal_hash: rawTx.hash }]
    });

    //no tx yet
    // forward to received_address
    if (!transaction) {
      // create tx at first tx
      if (!rawTx.confirmations) {
        return res.send({ status: 'ok' });
      }

      const depositAddressInfo = await getDepositAddressInfo({
        coinId,
        trackingId,
        rawTx
      });

      if (!depositAddressInfo) {
        return res.send({ status: 'ok' });
      }

      const depositInfo = getDepositDataOfAddress(
        depositAddressInfo.depositAddress
      )(rawTx);

      if (!depositInfo) {
        return res.send({ status: 'ok' });
      }

      const amountInSmallestUnit = depositInfo.value;
      const { minimumDeposit } = await getCoinConfigsOfTxType(coinId);

      if (
        amountInSmallestUnit <
        convertToPrimaryUnitForTx({ coinId, amount: minimumDeposit })
      ) {
        //todo : find a way to notice about this
        console.log('deposit amount is less than minimum deposit amount.');
        return res.json({ message: 'Amount is small than minimum deposit' });
      }

      const systemFeeInfo = await getSystemFee({
        coinId,
        amountInSmallestUnit
      });

      const ewallet = await EWallets.findOne({
        receiving_address: depositAddressInfo.destination
      });

      if (!ewallet) {
        return res.json({ message: 'wallet does not exist' });
      }

      const depositAmount = amountInSmallestUnit - systemFeeInfo.systemFee;

      const newTransaction = new Transactions({
        coin_id: coinId,
        tracking_id: trackingId,
        to_wallet_owner_id: depositAddressInfo.ownerId,
        hash: rawTx.hash,
        type: TYPE_TX_DEPOSIT,
        amount: depositAmount, //smallest unit
        original_amount: amountInSmallestUnit,
        fee: systemFeeInfo.systemFee,
        fixed_fee: systemFeeInfo.minimumValue,
        fee_percentage: systemFeeInfo.percentage,
        received_address: depositAddressInfo.depositAddress,
        destination: depositAddressInfo.destination,
        belong_to: ewallet.id
      });

      await newTransaction.save();

      PubSub.emit(EVENT_TRANSACTION_CREATED, newTransaction);
    } else {
      // this is Transfer tx
      if (rawTx.hash === transaction.hash) {
        if (
          rawTx.confirmations &&
          rawTx.confirmations >= BC_CONFIRMATION_THRESHOLD &&
          transaction.status !== TRANSACTION_FINISHED
        ) {
          transaction.status = TRANSACTION_FINISHED;

          transaction.save();
          PubSub.emit(EVENT_TRANSACTION_FINISHED, transaction);

          //forwardTx
          const depositAddressInfo = await getDepositAddressInfo({
            coinId,
            trackingId,
            rawTx
          });

          const depositInfo = getDepositDataOfAddress(
            depositAddressInfo.depositAddress
          )(rawTx);

          const systemFeeInfo = await getSystemFee({
            coinId,
            amountInSmallestUnit: transaction.original_amount
          });

          const newTx = await cryptoLib.createNewTx({
            fromAddress: depositAddressInfo.depositAddress,
            toAddress: depositAddressInfo.destination,
            amount: depositInfo.value,
            privateKey: depositAddressInfo.privateKey
          });

          if (!newTx || !newTx.tx) {
            return res.send({ status: 'ok' });
          }

          const newTxObj = newTx.tx;
          transaction.internal_hash = newTxObj.hash;
          transaction.fee_network = newTxObj.fees;
          transaction.extra_amount = systemFeeInfo.systemFee - newTxObj.fees;
          transaction.internal_status = TRANSACTION_PENDING;

          transaction.save();
        } else {
          //send status ok
          return res.send({ status: 'ok' });
        }

        // this is forward tx
      } else if (
        rawTx.confirmations &&
        rawTx.confirmations >= BC_CONFIRMATION_THRESHOLD
      ) {
        Transactions.updateMany(
          {
            internal_hash: rawTx.hash
          },
          {
            $set: {
              internal_status: TRANSACTION_FINISHED
            }
          }
        );
      }
    }

    return res.send({ status: 'ok' });
  } catch (error) {
    console.error('Deposit nonPF error : ', error);
    return res.json({ status: 'not ok' });
  }
};

export const depositERC20 = async (req, res) => {
  console.log('deposit req:', req.params, req.body);
  /*todo:
   * -fill gas for address
   * - forward to holder account.
   */

  const { toAddress, value, hash, event } = req.body;
  const { coinId, trackingId } = req.params;
  const amountInSmallestUnit = value;
  try {
    const ewallet = await EWallets.findOne({
      coin_id: coinId,
      [`old_deposit_addresses.${trackingId}`]: { $in: [toAddress] }
    });

    if (!ewallet) {
      return res.json({
        message: 'wallet does not exist'
      });
    }

    const { minimumDeposit } = await getCoinConfigsOfTxType(coinId);

    if (value < convertToPrimaryUnitForTx({ coinId, amount: minimumDeposit })) {
      return res.json({ message: 'Amount is small than minimum deposit' });
    }

    if (event === 'new-erc20-tx') {
      const systemFeeInfo = await getSystemFee({
        coinId,
        amountInSmallestUnit
      });

      const depositAmount = amountInSmallestUnit - systemFeeInfo.systemFee;

      const transaction = new Transactions({
        coin_id: coinId,
        tracking_id: trackingId,
        to_wallet_owner_id: ewallet.owner_id,
        hash: hash, //TODO: get hash
        //internal_hash: null,
        type: TYPE_TX_DEPOSIT,
        amount: depositAmount, //smallest unit // deposit amount after fee
        original_amount: value,
        fee: systemFeeInfo.systemFee,
        fixed_fee: systemFeeInfo.minimumValue,
        fee_percentage: systemFeeInfo.percentage,
        fee_network: 0,
        extra_amount: 0,
        received_address: toAddress,
        belong_to: ewallet.id
      });

      await transaction.save();

      PubSub.emit(EVENT_TRANSACTION_CREATED, transaction);

      // 1st event of forwards: forwarding to destination
    }
    //tx done
    else if (event === 'finished-erc20-tx') {
      //todo : we didn't forward tx yet, so query internal_hash is unnecessary. I'll comment this for future use.
      // let transaction = await Transactions.findOne({
      //   $or: [{ hash: hash }, { internal_hash: hash }]
      // });

      let transaction = await Transactions.findOne({
        hash
      });

      if (!transaction) {
        console.error('cannot find this tx_hash: ', hash);
      } else if (transaction.status !== TRANSACTION_FINISHED) {
        transaction.status = TRANSACTION_FINISHED;
        transaction.destination = ewallet.receiving_address;

        await transaction.save();

        PubSub.emit(EVENT_TRANSACTION_FINISHED, transaction);
      } else {
        console.error('tx was finished before ', hash);
      }
    }

    return res.json({ status: 'ok' });
  } catch (error) {
    console.error('Deposit PF error : ', error);
    return res.json({ status: 'not ok' });
  }
};
