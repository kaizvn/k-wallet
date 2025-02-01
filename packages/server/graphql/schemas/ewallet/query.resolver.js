import { combineResolvers } from 'graphql-resolvers';
import i18n from 'i18n';
import {
  getDataWithFilter,
  formatFilter,
  findAllUserIdAndPartnerId
} from '../../../utils';
import { EWallets, WalletAddresses, WalletKeys } from '../../../services';
import { SYS_ADMIN, SYS_MOD, P_MEM } from '../../enums/userRoles';
import { checkAuthentication, checkAuthorization } from '../../libs';
import { getAvailableCoins } from '../../../services/cryptoLibs';

export default {
  Query: {
    get_user_ewallet: combineResolvers(
      checkAuthorization(SYS_MOD),
      (_, { id }) => EWallets.findOne({ id })
    ),
    get_user_ewallets: combineResolvers(
      checkAuthorization(SYS_MOD),
      (_, { id }) => EWallets.find({ owner_id: id })
    ),
    get_all_user_ewallets: combineResolvers(checkAuthorization(SYS_MOD), () =>
      EWallets.find()
    ),
    get_my_ewallets: combineResolvers(
      checkAuthentication,
      async (_, __, { currentUser }) => {
        if (currentUser.role === P_MEM) {
          return [];
        }

        const availableCoins = getAvailableCoins();

        return EWallets.find({
          owner_id: currentUser.partner_id || currentUser.id,
          coin_id: { $in: availableCoins }
        });
      }
    ),
    get_partner_ewallets: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      (_, { partnerId }) => EWallets.find({ owner_id: partnerId })
    ),
    get_quick_filter_ewallets_by_coin_id: combineResolvers(
      checkAuthorization([SYS_ADMIN, SYS_MOD]),
      async (_, { coinId, filter }, { currentUser }) => {
        const formatedFilter = await formatFilter(filter, currentUser.id);

        const condition = coinId ? { coin_id: coinId } : {};
        if (formatedFilter.filterContents) {
          const arrId = await findAllUserIdAndPartnerId({
            $text: { $search: formatedFilter.filterContents }
          });

          condition['$or'] = [
            { receiving_address: formatedFilter.filterContents },
            { owner_id: { $in: arrId } }
          ];
        }

        const { pageInfos, data } = await getDataWithFilter({
          collection: EWallets,
          condition,
          options: formatedFilter
        });
        return { pageInfos, ewallets: data };
      }
    ),
    get_private_info_ewallet: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { address }) => {
        const walletAddress = await WalletAddresses.findOne({ address });

        if (walletAddress) {
          const walletKey = await WalletKeys.findOne({
            wallet_address_id: walletAddress.id
          });

          if (walletKey) {
            return {
              address: walletAddress.address,
              walletKey: walletKey.wallet_key
            };
          }

          throw new Error(i18n.__('ewallet.query.error.not_found_wallet_key'));
        }

        throw new Error(
          i18n.__('ewallet.query.error.not_found_wallet_address')
        );
      }
    ),
    get_virtual_wallets: combineResolvers(
      checkAuthentication,
      async (_, __, { currentUser, currentPartner }) => {
        const isAuthorized = !checkAuthorization(SYS_MOD)(null, null, {
          currentUser
        });
        const arrEWallet = !isAuthorized
          ? await EWallets.find({
              owner_id: currentPartner.id || currentUser.id
            }).sort({ coin_id: 1 })
          : EWallets.aggregate([
              {
                $group: {
                  _id: '$coin_id',
                  coin_id: { $first: '$coin_id' },
                  balance: { $sum: '$balance' }
                }
              },
              { $sort: { _id: 1 } }
            ]);

        return arrEWallet || [];
      }
    )
  }
};
