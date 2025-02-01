// TODO - refactor this file
import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import { findPartner } from '../../../utils';
import { EWallets, Partners } from '../../../services';
import { P_OWNER, SYS_ADMIN, SYS_MOD } from '../../enums/userRoles';
import { WALLET_PARTNER } from '../../enums/walletType';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { syncEwalletWithNetwork } from '../../../services/ewallet';

const createWallet = () => Math.random().toString();

export default {
  Mutation: {
    // xxxx ???
    create_user_ewallet: combineResolvers(
      checkAuthentication,
      async (_, { userId, name, coinId }, { currentUser }) => {
        if (currentUser.role === SYS_ADMIN && !userId) {
          throw new Error(
            i18n.__('ewallet.mutation.error.missing_param.user_id')
          );
        }

        userId = !currentUser.role ? currentUser.id : userId;

        // TODO - refactor this
        const depositAddresses = [createWallet()];
        const receivingAddress = createWallet();

        const eWallet = new EWallets({
          name,
          coin_id: coinId,
          owner_id: userId,
          created_by: currentUser.id,
          deposit_addresses: depositAddresses,
          receiving_address: receivingAddress
        });

        await eWallet.save();
        return eWallet;
      }
    ),
    // xxxx ???
    create_partner_ewallet: combineResolvers(
      checkAuthorization([SYS_ADMIN, P_OWNER]),
      async (_, { partnerId, name, coinId }, { currentUser }) => {
        if (!partnerId && currentUser.role === P_OWNER) {
          const partner = await Partners.findOne({ owner_id: currentUser.id });
          partnerId = partner.id;
        }

        const depositAddresses = [createWallet()];
        const receivingAddress = createWallet();

        const eWallet = new EWallets({
          name,
          coin_id: coinId,
          owner_id: partnerId,
          created_by: currentUser.id,
          deposit_addresses: depositAddresses,
          receiving_address: receivingAddress,
          type: WALLET_PARTNER
        });

        await eWallet.save();
        return eWallet;
      }
    ),
    // xxxx ???
    update_user_ewallet: combineResolvers(
      checkAuthentication,
      async (_, { id, name, walletAddresses }, { currentUser }) => {
        const eWallet = await EWallets.findOne({ id });

        if (
          currentUser.id !== eWallet.owner_id &&
          currentUser.role !== SYS_ADMIN
        ) {
          throw new Error(
            i18n.__('ewallet.mutation.error.permission.update_user_ewallet')
          );
        }

        if (name) {
          eWallet.name = name;
        }

        if (walletAddresses && walletAddresses.length) {
          eWallet.deposit_addresses = eWallet.deposit_addresses.concat(
            walletAddresses
          );
        }

        await eWallet.save();
        return eWallet;
      }
    ),
    // xxxx ???
    update_partner_ewallet: combineResolvers(
      checkAuthorization([SYS_ADMIN, P_OWNER]),
      async (_, { id, name, walletAddresses }, { currentUser }) => {
        const wallet = await EWallets.findOne({ id });
        const partner = await findPartner(wallet.owner_id);

        if (
          currentUser.id !== partner.owner_id &&
          currentUser.role !== SYS_ADMIN
        ) {
          throw new Error(
            i18n.__('ewallet.mutation.error.permission.update_partner_ewallet')
          );
        }

        if (name) {
          wallet.name = name;
        }

        if (walletAddresses && walletAddresses.length) {
          wallet.deposit_addresses = wallet.deposit_addresses.concat(
            walletAddresses
          );
        }

        await wallet.save();
        return wallet;
      }
    ),
    sync_ewallet_with_network: combineResolvers(
      checkAuthorization(SYS_MOD),
      async (_, { arrayId = [], options = {} }, { currentUser }) => {
        const ewallets = await EWallets.find({
          id: { $in: arrayId },
          receiving_address: { $exists: true }
        });
        if (!ewallets.length) {
          throw new Error(i18n.__('ewallet.mutation.error.not_found.ewallet'));
        }

        const ewalletsSynchronized = await syncEwalletWithNetwork(
          ewallets,
          options,
          currentUser
        );
        return ewalletsSynchronized;
      }
    )
  }
};
