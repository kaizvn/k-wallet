import { combineResolvers } from 'graphql-resolvers';
import { checkAuthentication, checkAuthorization } from '../../libs';
import i18n from 'i18n';
import { findUser, findPartner } from '../../../utils';
import { EWallets, Transactions } from '../../../services';
import { SYS_ADMIN } from '../../enums/userRoles';
import { TRANSACTION_FINISHED } from '../../enums/transactionStatus';
import { WALLET_PARTNER, WALLET_USER } from '../../enums/walletType';
import { HEIAU_COIN_ID } from '../../enums/coinId';

export default {
  Mutation: {
    pay_heiau: combineResolvers(
      checkAuthentication,
      async (
        _,
        { partnerId, amount, description, tx_type },
        { currentUser }
      ) => {
        const senderEwallet = await EWallets.findOne({
          coin_id: HEIAU_COIN_ID,
          owner_id: currentUser.id
        });

        if (!senderEwallet) {
          throw new Error(
            i18n.__('heiau.mutation.error.message.pay_heiau.no_ewallet')
          );
        }
        if (senderEwallet.balance <= amount) {
          throw new Error(
            i18n.__('heiau.mutation.error.message.pay_heiau.not_enough_balance')
          );
        }

        const receiverPartner = await findPartner({
          partner_id: partnerId
        });

        if (!receiverPartner) {
          throw new Error(i18n.__('heiau.mutation.error.not_exist.pay_heiau'));
        }
        let receiverEwallet = await EWallets.findOne({
          coin_id: HEIAU_COIN_ID,
          owner_id: receiverPartner.id
        });

        if (!receiverEwallet) {
          receiverEwallet = new EWallets({
            coin_id: HEIAU_COIN_ID,
            owner_id: receiverPartner.id,
            type: WALLET_PARTNER
          });
        }

        senderEwallet.safeSubtract(amount);
        receiverEwallet.safeAdd(amount);
        const newTransaction = new Transactions({
          from_wallet_owner_id: senderEwallet.owner_id,
          to_wallet_owner_id: receiverEwallet.owner_id,
          amount,
          status: TRANSACTION_FINISHED,
          coin_id: HEIAU_COIN_ID,
          tx_type,
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

    send_heiau: combineResolvers(
      checkAuthentication,
      async (
        _,
        { username, amount, description, tx_type },
        { currentUser, currentPartner }
      ) => {
        const senderEwallet = currentPartner
          ? await EWallets.findOne({
              coin_id: HEIAU_COIN_ID,
              owner_id: currentPartner.id
            })
          : await EWallets.findOne({
              coin_id: HEIAU_COIN_ID,
              owner_id: currentUser.id
            });

        if (!senderEwallet) {
          throw new Error(
            i18n.__('heiau.mutation.error.send_heiau.no_ewallet')
          );
        }
        if (senderEwallet.balance <= amount) {
          throw new Error(
            i18n.__('heiau.mutation.error.send_heiau.not_enough_balance')
          );
        }

        const receiverUser = await findUser({
          username
        });
        if (!receiverUser) {
          throw new Error(i18n.__('heiau.mutation.error.not_exist.send_heiau'));
        }

        let receiverEwallet = await EWallets.findOne({
          coin_id: HEIAU_COIN_ID,
          owner_id: receiverUser.id
        });
        if (!receiverEwallet) {
          receiverEwallet = new EWallets({
            coin_id: HEIAU_COIN_ID,
            owner_id: receiverUser.id,
            type: WALLET_USER
          });
        }

        senderEwallet.safeSubtract(amount);
        receiverEwallet.safeAdd(amount);
        const newTransaction = new Transactions({
          from_wallet_owner_id: senderEwallet.owner_id,
          to_wallet_owner_id: receiverEwallet.owner_id,
          amount: amount,
          status: TRANSACTION_FINISHED,
          coin_id: HEIAU_COIN_ID,
          tx_type,
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

    topup_heiau_admin: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { username, partnerId, amount }) => {
        const receiver = username
          ? await findUser({
              username
            })
          : await findPartner({ partner_id: partnerId });

        if (!receiver) {
          throw new Error(
            i18n.__('heiau.mutation.error.not_exist.topup_heiau_admin')
          );
        }

        let receiverEwallet = await EWallets.findOne({
          coin_id: HEIAU_COIN_ID,
          owner_id: receiver.id
        });
        if (!receiverEwallet) {
          receiverEwallet = new EWallets({
            coin_id: HEIAU_COIN_ID,
            owner_id: receiver.id
          });
          receiverEwallet.type = username ? WALLET_USER : WALLET_PARTNER;
        }

        receiverEwallet.safeAdd(amount);

        const newTransaction = new Transactions({
          from_wallet_owner_id: receiverEwallet.owner_id,
          to_wallet_owner_id: receiverEwallet.owner_id,
          amount: amount,
          status: TRANSACTION_FINISHED,
          coin_id: HEIAU_COIN_ID,
          description: 'top up to ' + (partnerId || username),
          tx_type: 'ORDER_TRANSFER'
        });

        await Promise.all([receiverEwallet.save(), newTransaction.save()]);

        return newTransaction;
      }
    )
  }
};
