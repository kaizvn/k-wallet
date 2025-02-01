import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';

import {
  Base,
  EWallets,
  Transactions,
  WalletAddresses,
  WalletKeys,
  Users,
  PartnerUsers,
  Coins
} from '../../../services';
import {
  EVENT_TRANSACTION_REJECTED,
  EVENT_TRANSACTION_APPROVAL,
  EVENT_TRANSACTION_CREATED
} from '../../../pubsub/events';
import { PubSub } from '../../../pubsub';
import { SYS_MOD, P_OWNER, SYS_ADMIN, P_MEM } from '../../enums/userRoles';
import {
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING_PARTNER_APPROVAL,
  TRANSACTION_PENDING_ADMIN_APPROVAL,
  TRANSACTION_REJECTED,
  TRANSACTION_PENDING,
  TRANSACTION_MANUAL_ADMIN
} from '../../enums/transactionStatus';
import { TYPE_TX_WITHDRAW, TYPE_TX_DEPOSIT } from '../../enums/transactionType';
import { WALLET_PARTNER, WALLET_USER } from '../../enums/walletType';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { findPartner, findUser, sleep } from '../../../utils';
import { getNetworkFee } from '../../../utils/bcUtils';
import { getCryptoLibByCoinId } from '../../../services/cryptoLibs';
import { getGeneralTransferLimit } from '../../../services/systemUser';
import { getInDayWithdrawn } from '../../../services/ewallet';
import { getPartnerTransferLimit } from '../../../services/partner';
import {
  sendCallback,
  deleteAddressHookAndPaymentForward,
  getCoinConfigsOfTxType,
  getSystemFee
} from '../../../services/base';
import { get } from 'lodash';

const getTxHash = get('tx.hash');

const processTransaction = async (tx) => {
  const fromWallet = await EWallets.findOne({
    owner_id: tx.from_wallet_owner_id,
    coin_id: tx.coin_id
  });

  if (!fromWallet) {
    throw new Error(
      i18n.__('transaction.mutation.error.message.not_has_ewallet')
    );
  }

  const walletAddress = await WalletAddresses.findOne(
    {
      address: fromWallet.receiving_address
    },
    { id: 1 }
  );
  let privateKey;
  const cryptoLib = getCryptoLibByCoinId(tx.coin_id);

  if (!cryptoLib.isBlockcypher) {
    const coin = await Coins.findOne({ id: tx.coin_id });
    if (!coin) {
      throw new Error(
        i18n.__('transaction.mutation.error.message.coin_not_found')
      );
    }
    privateKey = coin.master_key;
  } else {
    const privKeyDoc = await WalletKeys.findOne({
      wallet_address_id: walletAddress.id
    });
    if (!privKeyDoc) {
      throw new Error(
        i18n.__('transaction.mutation.error.not_found.wallet_key')
      );
    }
    privateKey = privKeyDoc.wallet_key;
  }

  const newTx =
    (await cryptoLib.createNewTx({
      fromAddress: fromWallet.receiving_address,
      toAddress: tx.to_wallet_owner_id,
      amount: tx.amount,
      privateKey
    })) || {};

  if (!getTxHash(newTx)) {
    throw new Error(
      i18n.__('transaction.mutation.error.message.cannot_transfer_addresses')
    );
  }

  await Transactions.updateOne(
    {
      id: tx.id
    },
    {
      hash: newTx.hash,
      status: TRANSACTION_PENDING
    }
  );

  cryptoLib.createHashHook({
    address: tx.to_wallet_owner_id,
    coinId: tx.coin_id,
    hash: newTx.hash,
    addressType: TYPE_TX_WITHDRAW
  });
};

module.exports = {
  Mutation: {
    pay: combineResolvers(
      checkAuthentication,
      async (
        _,
        { coinId, partnerId, amount, description },
        { currentUser }
      ) => {
        const convertedAmount = await Base.convertToPrimaryUnitForTx({
          coinId,
          amount
        });

        const senderEwallet = await EWallets.findOne({
          coin_id: coinId,
          owner_id: currentUser.id
        });

        if (!senderEwallet) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.pay.no_wallet')
          );
        }
        if (senderEwallet.balance <= convertedAmount) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.pay.not_enough_balance')
          );
        }

        const receiverPartner = await findPartner({
          partner_id: partnerId
        });
        if (!receiverPartner) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.pay.receiver_not_exist')
          );
        }
        let receiverEwallet = await EWallets.findOne({
          coin_id: coinId,
          owner_id: receiverPartner.id
        });
        if (!receiverEwallet) {
          receiverEwallet = new EWallets({
            coin_id: coinId,
            owner_id: receiverPartner.id,
            type: WALLET_PARTNER
          });
        }

        senderEwallet.safeSubtract(convertedAmount);
        receiverEwallet.safeAdd(convertedAmount);

        const newTransaction = new Transactions({
          from_wallet_owner_id: senderEwallet.owner_id,
          to_wallet_owner_id: receiverEwallet.owner_id,
          amount: convertedAmount,
          status: TRANSACTION_FINISHED,
          coin_id: coinId,
          description
        });

        await Promise.all([
          senderEwallet.save(),
          receiverEwallet.save(),
          newTransaction.save()
        ]);

        return newTransaction;
      }
    ),

    send: combineResolvers(
      checkAuthentication,
      async (
        _,
        { coinId, username, amount, description },
        { currentUser, currentPartner }
      ) => {
        const convertedAmount = await Base.convertToPrimaryUnitForTx({
          coinId,
          amount
        });

        const senderEwallet = currentPartner
          ? await EWallets.findOne({
              coin_id: coinId,
              owner_id: currentPartner.id
            })
          : await EWallets.findOne({
              coin_id: coinId,
              owner_id: currentUser.id
            });

        if (!senderEwallet) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.send.no_wallet')
          );
        }
        if (senderEwallet.balance <= convertedAmount) {
          throw new Error(
            i18n.__(
              'transaction.mutation.error.message.send.not_enough_balance'
            )
          );
        }

        const receiverUser = await findUser({
          username
        });
        if (!receiverUser) {
          throw new Error(
            i18n.__(
              'transaction.mutation.error.message.send.receiver_not_exist'
            )
          );
        }

        let receiverEwallet;
        receiverEwallet = await EWallets.findOne({
          coin_id: coinId,
          owner_id: receiverUser.id
        });
        if (!receiverEwallet) {
          receiverEwallet = await Base.createNewEWallet({
            coinId,
            ownerId: receiverUser.id,
            type: WALLET_USER
          });
        }

        senderEwallet.safeSubtract(convertedAmount);
        receiverEwallet.safeAdd(convertedAmount);

        const newTransaction = new Transactions({
          from_wallet_owner_id: senderEwallet.owner_id,
          to_wallet_owner_id: receiverEwallet.owner_id,
          amount: convertedAmount,
          status: TRANSACTION_FINISHED,
          coin_id: coinId,
          description
        });

        await Promise.all([
          senderEwallet.save(),
          receiverEwallet.save(),
          newTransaction.save()
        ]);

        return newTransaction;
      }
    ),

    create_deposit_address: combineResolvers(
      checkAuthentication,
      async (_, { trackingId, coinId }, { currentUser, currentPartner }) => {
        const depositAddress = await Base.createNewDepositAddress({
          coinId,
          trackingId,
          currentUser,
          currentPartner
        });
        return depositAddress;
      }
    ),
    renew_deposit_address: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (
        _,
        { username, trackingId, coinId, emptyDepositAddresses = false }
      ) => {
        username = username.toLowerCase();
        const userInfo =
          (await Users.findOne({ username })) ||
          (await PartnerUsers.findOne({ username }));

        if (!userInfo) {
          throw new Error(i18n.__('transaction.mutation.error.not_found.user'));
        }
        try {
          const partner = await Base.getCurrentPartner(userInfo);

          let ewallet = await Base.getCurrentUserEwallet({
            userId: userInfo.id,
            partnerId: !!partner ? partner.id : userInfo.id,
            coinId
          });

          if (!!ewallet.deposit_addresses[trackingId]) {
            await deleteAddressHookAndPaymentForward({
              address: ewallet.deposit_addresses[trackingId],
              coinId
            });

            delete ewallet.deposit_addresses[trackingId];
            ewallet.markModified('deposit_addresses');

            await ewallet.save();
            return true;
          } else if (emptyDepositAddresses) {
            for (const trackingKey in ewallet.deposit_addresses) {
              await sleep(1200);
              await deleteAddressHookAndPaymentForward({
                address: ewallet.deposit_addresses[trackingKey],
                coinId
              });
              delete ewallet.deposit_addresses[trackingKey];
            }

            ewallet.markModified('deposit_addresses');
            await ewallet.save();
            return true;
          } else {
            return new Error(
              i18n.__('transaction.mutation.error.invalid.tracking_id')
            );
          }
        } catch (error) {
          console.log('renew_deposit_address:', { error });
          return false;
        }
      }
    ),

    create_withdraw_transaction: combineResolvers(
      checkAuthentication,
      async (
        _,
        { recipientAddress, coinId, amount, trackingId },
        { currentUser, currentPartner }
      ) => {
        let privateKey;
        if (currentUser.role === P_MEM) return {};

        if (amount <= 0) {
          throw new Error(i18n.__('transaction.mutation.error.message.amount'));
        }

        const { minimumValue } = await getCoinConfigsOfTxType(coinId);
        if (amount < minimumValue) {
          throw new Error(
            i18n.__(
              'transaction.mutation.error.message.withdraw.under_minimum_value'
            )
          );
        }

        // todo : verify limit >> lower : status = pending , higher: status = pending_approval
        // create eth transfer transaction
        const ownerId = currentPartner ? currentPartner.id : currentUser.id;
        const fromWallet = await EWallets.findOne({
          owner_id: ownerId,
          coin_id: coinId
        });

        if (!fromWallet) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.not_has_ewallet')
          );
        }

        try {
          const cryptoLib = getCryptoLibByCoinId(coinId);

          const smallestUnitAmount = cryptoLib.fromLargestToSmallestUnit(
            amount
          );

          const systemFeeInfo = await getSystemFee({
            coinId,
            amountInSmallestUnit: smallestUnitAmount
          });

          const globalFee = await cryptoLib.getGlobalFee();

          if (
            fromWallet.balance <
            smallestUnitAmount + systemFeeInfo.systemFee
          ) {
            throw new Error(
              i18n.__('transaction.mutation.error.message.insufficient_balance')
            );
          }

          let txSkeleton;
          let txNetWorkBalance;

          const transaction = new Transactions({
            amount: smallestUnitAmount,
            fee_percentage: systemFeeInfo.percentage,
            coin_id: coinId,
            tracking_id: trackingId,
            from_wallet_owner_id: ownerId,
            to_wallet_owner_id: recipientAddress,
            type: TYPE_TX_WITHDRAW,
            fee: systemFeeInfo.systemFee,
            belong_to: fromWallet.id
          });
          //work around for eth
          if (!cryptoLib.isBlockcypher) {
            const coin = await Coins.findOne({ id: coinId });
            if (!coin) {
              throw new Error(
                i18n.__('transaction.mutation.error.message.coin_not_found')
              );
            }

            txNetWorkBalance = await cryptoLib.getBalance(coin.master_address);

            if (
              fromWallet.balance > txNetWorkBalance.balance &&
              smallestUnitAmount > txNetWorkBalance.balance
            ) {
              transaction.status = TRANSACTION_MANUAL_ADMIN;
            } else {
              txSkeleton = await cryptoLib.createTxSkeleton({
                privateKey,
                toAddress: recipientAddress,
                amount: smallestUnitAmount
              });
            }
            privateKey = coin.master_key;
          } else {
            txNetWorkBalance =
              (await cryptoLib.getBalance(fromWallet.receiving_address)) || {};
            if (
              fromWallet.balance > txNetWorkBalance.balance &&
              smallestUnitAmount > txNetWorkBalance.balance
            ) {
              transaction.status = TRANSACTION_MANUAL_ADMIN;
            } else {
              txSkeleton = await cryptoLib.createTxSkeleton({
                fromAddress: fromWallet.receiving_address,
                toAddress: recipientAddress,
                amount: smallestUnitAmount,
                fees: globalFee
              });
            }
          }

          if (transaction.status !== TRANSACTION_MANUAL_ADMIN) {
            if (!txSkeleton || !txSkeleton.tx) {
              throw new Error('Cannot create new transaction');
            }

            const txNetWorkFee = getNetworkFee(txSkeleton);

            transaction.fee_network = txNetWorkFee;
            transaction.extra_amount = systemFeeInfo.systemFee - txNetWorkFee;

            const inDayWithdrawn = await getInDayWithdrawn(
              fromWallet.id,
              coinId
            );

            const limitTransfer = currentPartner
              ? await getPartnerTransferLimit(currentPartner.partner_id)
              : await getGeneralTransferLimit();

            if (inDayWithdrawn + amount > limitTransfer) {
              let status = TRANSACTION_PENDING_PARTNER_APPROVAL;

              if (!currentPartner) {
                status = TRANSACTION_PENDING_ADMIN_APPROVAL;
              }
              transaction.status = status;
            } else {
              if (cryptoLib.isBlockcypher) {
                const walletAddress = await WalletAddresses.findOne(
                  { address: fromWallet.receiving_address },
                  { id: 1 }
                );

                const privKeyDoc = await WalletKeys.findOne({
                  wallet_address_id: walletAddress.id
                });

                if (!privKeyDoc) {
                  throw new Error('Cannot find privateKey');
                }
                privateKey = privKeyDoc.wallet_key;
              }

              let broadcastedTx = await cryptoLib.broadcastTx(
                txSkeleton,
                privateKey
              );

              const newTxObj = broadcastedTx.tx;

              if (!newTxObj || !newTxObj.hash) {
                throw new Error(
                  i18n.__(
                    'transaction.mutation.error.message.cannot_transfer_addresses'
                  )
                );
              }

              transaction.hash = newTxObj.hash;

              cryptoLib.createHashHook({
                coinId,
                address: recipientAddress,
                hash: transaction.hash,
                addressType: TYPE_TX_WITHDRAW
              });
            }
          }

          // create transaction
          const session = await Transactions.startSession();

          const totalAmount = smallestUnitAmount + transaction.fee;

          await session.withTransaction(async () => {
            await transaction.save({ session });

            // update balance
            await EWallets.updateOne(
              { owner_id: ownerId, coin_id: coinId },
              {
                $inc: {
                  balance: 0 - totalAmount,
                  locked_balance: totalAmount
                }
              },
              { session }
            );
          });

          PubSub.emit(EVENT_TRANSACTION_CREATED, transaction);
          return transaction;
        } catch (err) {
          throw err;
        }
      }
    ),

    approve_pending_transaction: combineResolvers(
      checkAuthorization([P_OWNER, SYS_ADMIN]),
      async (_, { id }, { currentPartner }) => {
        let conditionFindTx = {
          id,
          status: {
            $in: [TRANSACTION_PENDING_ADMIN_APPROVAL, TRANSACTION_MANUAL_ADMIN]
          }
        };
        if (currentPartner) {
          conditionFindTx.status = TRANSACTION_PENDING_PARTNER_APPROVAL;
          conditionFindTx.from_wallet_owner_id = currentPartner.id;
        }
        let tx = await Transactions.findOne(conditionFindTx);
        if (!tx) {
          throw new Error(
            i18n.__(
              'transaction.mutation.error.invalid.pending_approval_transaction'
            )
          );
        }

        if (tx.status === TRANSACTION_PENDING_PARTNER_APPROVAL) {
          const fromWallet = await EWallets.findOne({
            owner_id: tx.from_wallet_owner_id,
            coin_id: tx.coin_id
          });

          if (!fromWallet) {
            throw new Error(
              i18n.__('transaction.mutation.error.not_found.ewallet')
            );
          }

          const inDayWithdrawn = await getInDayWithdrawn(fromWallet.id);
          const adminLimit = await getGeneralTransferLimit();
          const cryptoLib = await getCryptoLibByCoinId(tx.coin_id);

          const largestAmount = cryptoLib.fromSmallestToLargestUnit(tx.amount);

          if (inDayWithdrawn + largestAmount >= adminLimit) {
            tx.status = TRANSACTION_PENDING_ADMIN_APPROVAL;
            await tx.save();
            PubSub.emit(EVENT_TRANSACTION_APPROVAL, tx);
            return tx;
          }
        }

        await processTransaction(tx);

        PubSub.emit(EVENT_TRANSACTION_APPROVAL, tx);

        return tx;
      }
    ),
    reject_pending_transaction: combineResolvers(
      checkAuthorization([P_OWNER, SYS_ADMIN]),
      async (_, { id }, { currentPartner }) => {
        let conditionFindTx = {
          id,
          status: [TRANSACTION_PENDING_ADMIN_APPROVAL, TRANSACTION_MANUAL_ADMIN]
        };
        if (currentPartner) {
          conditionFindTx.status = TRANSACTION_PENDING_PARTNER_APPROVAL;
          conditionFindTx.from_wallet_owner_id = currentPartner.id;
        }
        let tx = await Transactions.findOne(conditionFindTx);
        if (!tx) {
          throw new Error(
            i18n.__(
              'transaction.mutation.error.invalid.pending_approval_transaction'
            )
          );
        }
        tx.status = TRANSACTION_REJECTED;
        await tx.save();
        PubSub.emit(EVENT_TRANSACTION_REJECTED, tx);
        return tx;
      }
    ),
    //rewrite this
    force_recheck_address: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { address }) => {
        const walletAddress = await WalletAddresses.findOne({ address });
        if (!walletAddress) {
          throw new Error(
            i18n.__('transaction.mutation.error.not_found.address')
          );
        }

        if (walletAddress.processed === 0) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.address_processed')
          );
        }

        await Base.getNewTransactionsOfAddress({
          address: walletAddress.address,
          coinId: walletAddress.coin_id
        });

        return true;
      }
    ),

    //rewrite this
    force_recheck_wallet: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { walletId }) => {
        const ewallet = await EWallets.findOne({ id: walletId });
        if (!ewallet) {
          throw new Error(
            i18n.__('transaction.mutation.error.not_found.ewallet')
          );
        }

        const depositAddresses = ewallet.deposit_addresses || [];
        console.log('depositAddresses', depositAddresses);

        for (let address of depositAddresses) {
          await Base.getNewTransactionsOfAddress({
            coinId: ewallet.coin_id,
            address
          });
        }

        return true;
      }
    ),

    resend_callback: combineResolvers(
      checkAuthorization(P_MEM),
      async (_, { id }) => {
        const tx = await Transactions.findOne({ id });

        let partner;
        if (tx.type === TYPE_TX_DEPOSIT) {
          partner = await findPartner(tx.to_wallet_owner_id);
        } else if (tx.type === TYPE_TX_WITHDRAW) {
          partner = await findPartner(tx.from_wallet_owner_id);
        }

        if (partner) {
          return sendCallback({
            ownerId: partner.id,
            txDetail: tx
          });
        }
        return true;
      }
    ),
    manual_transaction: combineResolvers(
      checkAuthorization(SYS_ADMIN),
      async (_, { hash, txId }) => {
        const tx = await Transactions.findOne({ id: txId });
        if (!tx) {
          throw new Error(
            i18n.__('transaction.mutation.error.not_found.transaction')
          );
        }
        const cryptoLib = getCryptoLibByCoinId(tx.coin_id);

        const txDetails = await cryptoLib.getTxDetails(hash);
        if (!txDetails) {
          throw new Error(i18n.__('transaction.mutation.error.invalid.hash'));
        }

        const BC_CONFIRMATION_THRESHOLD =
          parseInt(process.env.BC_CONFIRMATION_THRESHOLD) || 3;

        const systemFeeInfo = await getSystemFee({
          coinId: tx.coin_id,
          amountInSmallestUnit: tx.amount
        });

        let txNetWorkFee;

        if (!cryptoLib.isBlockcypher) {
          txNetWorkFee = cryptoLib.getGlobalFee();
        } else {
          txNetWorkFee = txDetails.fees;
        }

        tx.hash = txDetails.hash;
        tx.fee_network = txNetWorkFee;
        tx.extra_amount = systemFeeInfo.systemFee - txNetWorkFee;

        if (txDetails.confirmations >= BC_CONFIRMATION_THRESHOLD) {
          tx.status = TRANSACTION_FINISHED;
        } else {
          tx.status = TRANSACTION_PENDING;
        }

        await tx.save();
        tx.status !== TRANSACTION_FINISHED &&
          cryptoLib.createHashHook({
            coinId: tx.coin_id,
            address: tx.to_wallet_owner_id,
            hash,
            addressType: TYPE_TX_WITHDRAW
          });

        return tx;
      }
    )
  }
};
