import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';

import { EWallets, Transactions, Coins } from '../../../services';
import { SYS_ADMIN, SYS_MOD, P_OWNER } from '../../enums/userRoles';
import {
  TRANSACTION_PENDING_PARTNER_APPROVAL,
  TRANSACTION_PENDING_ADMIN_APPROVAL,
  TRANSACTION_MANUAL_ADMIN
} from '../../enums/transactionStatus';
import {
  TYPE_TX_TRANSFER,
  TYPE_TX_WITHDRAW
} from '../../enums/transactionType';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { formatBCEtherAddress, getNetworkFee } from '../../../utils/bcUtils';
import { getCryptoLibByCoinId } from '../../../services/cryptoLibs';
import {
  getDataWithFilter,
  formatFilter,
  findAllUserIdAndPartnerId
} from '../../../utils';
import { getSystemFee } from '../../../services/base';

module.exports = {
  Query: {
    get_all_transactions: combineResolvers(
      checkAuthentication,
      async (_, { filter }, { currentUser, currentPartner }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);
        const ownerId = (currentPartner || currentUser).id;
        const condition = {};

        const notAuthorized = checkAuthorization(SYS_MOD)(_, null, {
          currentUser
        });
        if (notAuthorized) {
          condition['$or'] = [
            { from_wallet_owner_id: ownerId },
            { to_wallet_owner_id: ownerId }
          ];
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: Transactions,
          condition,
          options: formatedFilter
        });
        return { pageInfos, transactions: data };
      }
    ),

    get_quick_filter_transactions: combineResolvers(
      checkAuthentication,
      async (_, { filter }, { currentUser, currentPartner }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);
        const ownerId = (currentPartner || currentUser).id;
        const condition = { type: TYPE_TX_TRANSFER };

        let arrId = [];
        if (formatedFilter.filterContents) {
          arrId = await findAllUserIdAndPartnerId({
            $text: { $search: formatedFilter.filterContents }
          });
          condition['$or'] = [
            { from_wallet_owner_id: { $in: arrId } },
            { to_wallet_owner_id: { $in: arrId } }
          ];
        }

        const notAuthorized = checkAuthorization(SYS_MOD)(_, null, {
          currentUser
        });
        if (notAuthorized) {
          condition['$or'] =
            formatedFilter.filterContents && !arrId.includes(ownerId)
              ? [
                  {
                    $and: [
                      { to_wallet_owner_id: { $in: arrId } },
                      { from_wallet_owner_id: ownerId }
                    ]
                  },
                  {
                    $and: [
                      { from_wallet_owner_id: { $in: arrId } },
                      { to_wallet_owner_id: ownerId }
                    ]
                  }
                ]
              : [
                  { from_wallet_owner_id: ownerId },
                  { to_wallet_owner_id: ownerId }
                ];
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: Transactions,
          condition,
          options: formatedFilter
        });
        return { pageInfos, transactions: data };
      }
    ),

    get_transaction: combineResolvers(
      checkAuthentication,
      async (_, { id }, { currentUser, currentPartner }) => {
        if ([SYS_ADMIN, SYS_MOD].includes(currentUser.role)) {
          return Transactions.findOne({ id });
        } else if (currentPartner) {
          return Transactions.findOne({
            id,
            $or: [
              { from_wallet_owner_id: currentPartner.id },
              { to_wallet_owner_id: currentPartner.id }
            ]
          });
        } else {
          return Transactions.findOne({
            id,
            $or: [
              { from_wallet_owner_id: currentUser.id },
              { to_wallet_owner_id: currentUser.id }
            ]
          });
        }
      }
    ),

    get_required_partner_approval_transactions: combineResolvers(
      checkAuthorization(P_OWNER),
      (_, __, { currentPartner }) =>
        Transactions.find({
          from_wallet_owner_id: currentPartner.id,
          status: TRANSACTION_PENDING_PARTNER_APPROVAL
        })
    ),

    get_required_admin_approval_transactions: combineResolvers(
      checkAuthorization(SYS_MOD),
      () =>
        Transactions.find({
          status: TRANSACTION_PENDING_ADMIN_APPROVAL
        })
    ),

    get_quick_filter_payments: combineResolvers(
      checkAuthentication,
      async (_, { filter }, { currentUser, currentPartner }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);
        const ownerId = (currentPartner || currentUser).id;
        const condition = {
          type: { $ne: TYPE_TX_TRANSFER },
          status: {
            $nin: [
              TRANSACTION_PENDING_ADMIN_APPROVAL,
              TRANSACTION_PENDING_PARTNER_APPROVAL
            ]
          }
        };

        if (formatedFilter.filterContents) {
          condition['hash'] = formatedFilter.filterContents;
        }

        const notAuthorized = checkAuthorization(SYS_MOD)(_, null, {
          currentUser
        });
        if (notAuthorized) {
          condition['$or'] = [
            { to_wallet_owner_id: ownerId },
            { from_wallet_owner_id: ownerId }
          ];
        } else {
          condition.status['$nin'].push(TRANSACTION_MANUAL_ADMIN);
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: Transactions,
          condition,
          options: formatedFilter
        });
        return { pageInfos, transactions: data };
      }
    ),

    get_withdraw_tx_info: combineResolvers(
      checkAuthentication,
      async (
        _,
        { recipientAddress, coinId, amount },
        { currentUser, currentPartner }
      ) => {
        const ownerId = currentPartner ? currentPartner.id : currentUser.id;
        recipientAddress = formatBCEtherAddress(recipientAddress);

        const fromWallet = await EWallets.findOne({
          owner_id: ownerId,
          coin_id: coinId
        });

        if (!fromWallet) {
          throw new Error(
            i18n.__('transaction.mutation.error.message.not_has_ewallet')
          );
        }

        const cryptoLib = getCryptoLibByCoinId(coinId);
        const smallestUnitAmount = cryptoLib.fromLargestToSmallestUnit(amount);

        try {
          const newTx = await cryptoLib.createTxSkeleton({
            fromAddress: fromWallet.receiving_address,
            toAddress: recipientAddress,
            amount: smallestUnitAmount
          });

          const systemFeeInfo = await getSystemFee({
            coinId,
            amountInSmallestUnit: smallestUnitAmount
          });

          if (!newTx || !newTx.tx) {
            throw new Error('Cannot create new transaction');
          }

          return {
            coinId,
            toAddress: recipientAddress,
            amount,
            fee: cryptoLib.fromSmallestToLargestUnit(
              Math.max(systemFeeInfo.systemFee, getNetworkFee(newTx))
            )
          };
        } catch (error) {
          //more than fee
          if (
            error.tx &&
            fromWallet.balance < smallestUnitAmount + error.tx.fees
          ) {
            const maxAmount = cryptoLib.fromSmallestToLargestUnit(
              smallestUnitAmount - error.tx.fees
            );

            throw new Error(
              `Not enough funds to complete the transaction, maximum amount : ${maxAmount}`
            );
          }
          throw new Error('cannot fetch withdraw info.');
        }
      }
    ),
    get_quick_filter_pending_transactions: combineResolvers(
      checkAuthentication,
      async (_, { filter }, { currentUser, currentPartner }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);
        const ownerId = (currentPartner || currentUser).id;
        const condition = {
          type: { $in: [TYPE_TX_TRANSFER, TYPE_TX_WITHDRAW] },
          status: {
            $in: [TRANSACTION_PENDING_ADMIN_APPROVAL, TRANSACTION_MANUAL_ADMIN]
          }
        };

        let arrId = [];
        if (formatedFilter.filterContents) {
          arrId = await findAllUserIdAndPartnerId({
            $text: { $search: formatedFilter.filterContents }
          });
          condition['$or'] = [
            { from_wallet_owner_id: { $in: arrId } },
            { to_wallet_owner_id: { $in: arrId } }
          ];
        }

        const notAuthorized = checkAuthorization(SYS_MOD)(_, null, {
          currentUser
        });
        if (notAuthorized) {
          condition['status'] = {
            $in: [
              TRANSACTION_PENDING_PARTNER_APPROVAL,
              TRANSACTION_PENDING_ADMIN_APPROVAL
            ]
          };
          condition['$or'] =
            formatedFilter.filterContents && !arrId.includes(ownerId)
              ? [
                  {
                    $and: [
                      { to_wallet_owner_id: { $in: arrId } },
                      { from_wallet_owner_id: ownerId }
                    ]
                  },
                  {
                    $and: [
                      { from_wallet_owner_id: { $in: arrId } },
                      { to_wallet_owner_id: ownerId }
                    ]
                  }
                ]
              : [
                  { from_wallet_owner_id: ownerId },
                  { to_wallet_owner_id: ownerId }
                ];
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: Transactions,
          condition,
          options: formatedFilter
        });
        return { pageInfos, transactions: data };
      }
    ),
    get_withdraw_fees: combineResolvers(checkAuthentication, async () =>
      Coins.find()
    ),
    get_withdraw_fee: combineResolvers(checkAuthentication, (_, { coinId }) =>
      Coins.findOne({ id: coinId.toLocaleLowerCase() })
    )
  }
};
