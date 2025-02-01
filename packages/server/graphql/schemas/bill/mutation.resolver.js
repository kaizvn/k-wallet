import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import uuid from 'uuid';

import {
  BILL_CONFIRMED,
  BILL_CREATED,
  BILL_FAILED,
  BILL_PAID,
  BILL_PENDING,
  BILL_REVERTED
} from '../../enums/billStatus';
import { BILL_DEPOSIT, BILL_WITHDRAW } from '../../enums/billType';
import { Base, Bills, EWallets, Transactions } from '../../../services';
import { P_OWNER, SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import {
  TRANSACTION_PENDING,
  TRANSACTION_FAILED
} from '../../enums/transactionStatus';
import { TYPE_TX_WITHDRAW } from '../../enums/transactionType';
import { WALLET_PARTNER, WALLET_USER } from '../../enums/walletType';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { getCryptoLibByCoinId } from '../../../services/cryptoLibs';
import { getSystemFee } from '../../../services/base';

const revertEwalletBalanceWithdrawal = async ({ ewallet, bill }) => {
  const cryptoLib = getCryptoLibByCoinId(bill.coin_id);
  const fee = cryptoLib.getGlobalFee();
  const totalAmount = parseFloat(bill.amount) + parseFloat(fee);

  ewallet.safeAdd(totalAmount);
  await ewallet.save();
};

const getCurrentUserEwallet = async ({ currentUser, coinId }) => {
  let ewallet = currentUser.partner_id
    ? await EWallets.findOne({
        owner_id: currentUser.partner_id,
        coin_id: coinId
      })
    : await EWallets.findOne({
        owner_id: currentUser.id,
        coin_id: coinId
      });

  if (!ewallet) {
    ewallet = new EWallets({
      coin_id: coinId
    });
    switch (currentUser.role) {
      case P_OWNER:
        ewallet.type = WALLET_PARTNER;
        ewallet.owner_id = currentUser.partner_id;
        break;
      default:
        ewallet.type = WALLET_USER;
        ewallet.owner_id = currentUser.id;
    }
    await ewallet.save();
  }

  return ewallet;
};

const createNewBill = async (fields, { session } = {}) => {
  const newBill = new Bills(fields);
  await newBill.save({ session });

  return newBill;
};

const createNewTx = async (fields, { session } = {}) => {
  const newTx = new Transactions(fields);
  await newTx.save({ session });

  return newTx;
};

const lockEwalletBalance = (id, amount) =>
  EWallets.updateOne(
    { id },
    {
      $inc: {
        balance: 0 - amount,
        locked_balance: amount
      }
    }
  );

module.exports = {
  Mutation: {
    approve_bill: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      async (_, { id }) => {
        const bill = await Bills.findOne({ id });

        if (bill.status === BILL_PAID) {
          if (bill.type === BILL_DEPOSIT) {
            const session = await EWallets.startSession();
            await session.withTransaction(async () => {
              await EWallets.updateOne(
                {
                  owner_id: bill.owner_id,
                  coin_id: bill.coin_id
                },
                {
                  $inc: {
                    balance: bill.actual_amount
                  }
                },
                { session }
              );
              await Bills.updateOne(
                { id },
                { $set: { status: BILL_CONFIRMED } },
                { session }
              );
            });

            return bill;
          } else if (bill.type === BILL_WITHDRAW) {
            bill.status = BILL_CONFIRMED;

            await bill.save();
            return bill;
          }
        } else {
          throw new Error(i18n.__('bill.mutation.error.message.approve_bill'));
        }
      }
    ),

    revert_bill: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { id }) => {
        const bill = await Transactions.findOne({ id });
        if (bill.status === BILL_PAID) {
          if (bill.type === BILL_DEPOSIT) {
            bill.status = BILL_REVERTED;

            await bill.save();
            return bill;
          } else if (bill.type === BILL_WITHDRAW) {
            const ewallet = await EWallets.findOne({
              owner_id: bill.to_wallet_owner_id,
              coin_id: bill.coin_id
            });
            await revertEwalletBalanceWithdrawal({
              ewallet,
              bill
            });
            bill.status = BILL_REVERTED;

            await bill.save();
            return bill;
          }
        } else {
          throw new Error(i18n.__('bill.mutation.error.message.revert_bill'));
        }
      }
    ),
    //???
    create_withdraw_request: combineResolvers(
      checkAuthentication,
      async (
        _,
        {
          trackingId,
          recipientAddress,
          withdrawAmount,
          coinId,
          internalFee,
          networkFee
        },
        { currentUser }
      ) => {
        const convertedAmount = await Base.convertToPrimaryUnitForTx({
          coinId,
          amount: withdrawAmount
        });

        const totalAmount = convertedAmount + internalFee;

        const ewallet = await getCurrentUserEwallet({
          currentUser,
          coinId
        });
        if (ewallet.balance <= totalAmount) {
          throw new Error(
            i18n.__('bill.mutation.error.message.create_withdraw_request')
          );
        }

        try {
          const { percentage } = await getSystemFee({
            coinId,
            amountInSmallestUnit: convertedAmount
          });
          await lockEwalletBalance(ewallet.id, totalAmount);

          const billId = uuid();
          const newTx = await createNewTx({
            coin_id: coinId,
            bill_id: billId,
            tracking_id: trackingId,
            from_wallet_owner_id: ewallet.owner_id,
            amount: convertedAmount,
            fee_network: networkFee,
            fee: internalFee,
            extra_amount: internalFee - networkFee,
            fee_percentage: percentage,
            type: TYPE_TX_WITHDRAW,
            from_address: ewallet.receiving_address,
            to_address: recipientAddress,
            status: TRANSACTION_PENDING
          });

          const newBill = await createNewBill({
            id: billId,
            address: ewallet.receiving_address,
            tracking_id: trackingId,
            coin_id: coinId,
            transaction_ids: [newTx.id],
            owner_id: ewallet.owner_id,
            type: BILL_WITHDRAW,
            amount: convertedAmount,
            status: BILL_PENDING
          });
          return newBill;
        } catch (e) {
          console.error('withdraw request err:', e);
        }
      }
    ),

    approve_withdraw_request: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { id }) => {
        const bill = await Bills.findOne({ id, status: BILL_PENDING });
        if (!bill) {
          throw new Error(
            i18n.__('bill.mutation.error.not_exist.approve_withdraw')
          );
        }
        const tx = await Transactions.findOne({ id: bill.transaction_ids[0] });
        const withdrawAmount = tx.amount;
        const totalAmount = withdrawAmount + tx.fee;
        const recipientAddress = tx.to_address;
        const coinId = tx.coin_id;

        try {
          const txHash = await Base.transferCoin({
            smallestUnitAmount: withdrawAmount,
            senderAddress: bill.address,
            recipientAddress,
            coinId
          });

          await EWallets.updateOne(
            {
              owner_id: bill.owner_id,
              coin_id: coinId
            },
            { $inc: { locked_balance: -totalAmount } }
          );

          tx.hash = txHash;
          bill.status = BILL_CREATED;
          await Promise.all([bill.save(), tx.save()]);
          return bill;
        } catch (e) {
          console.error('withdraw error:', e);
        }
      }
    ),

    reject_withdraw_request: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { id }) => {
        const bill = await Bills.findOne({ id, status: BILL_PENDING });
        if (!bill) {
          throw new Error(
            i18n.__('bill.mutation.error.message.reject_withdraw_request')
          );
        }
        const tx = await Transactions.findOne({ id: bill.transaction_ids[0] });
        const withdrawAmount = tx.amount;
        const totalAmount = withdrawAmount + tx.fee;

        try {
          await EWallets.updateOne(
            {
              owner_id: bill.owner_id,
              coin_id: tx.coin_id
            },
            {
              $inc: { locked_balance: -totalAmount, balance: totalAmount }
            }
          );
          bill.status = BILL_FAILED;
          tx.status = TRANSACTION_FAILED;
          await Promise.all([bill.save(), tx.save()]);
          return bill;
        } catch (e) {
          console.error('withdraw error:', e);
        }
      }
    )
  }
};
