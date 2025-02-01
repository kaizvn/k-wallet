import { defaults } from 'lodash/fp';
import { combineResolvers } from 'graphql-resolvers';

import { Coins } from '../../../services';
import { SYS_ADMIN } from '../../enums/userRoles';
import { checkAuthorization } from '../../libs';
import { getCryptoLibExistsByCoinId } from '../../../services/cryptoLibs';
import { COIN_ACTIVE } from '../../enums/coinStatus';
import i18n from 'i18n';
import Activities from '../../../models/activities';
import { UPDATE_COIN_STATUS } from '../../enums/activities';

export default {
  Mutation: {
    add_new_coin: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (
        _,
        {
          id,
          name,
          symbol,
          logo,
          minimumWithdrawal,
          minimumDeposit,
          feePercentage,
          feeFixed,
          isCompoundSupport,
          contractAddress,
          decimals,
          network,
          isPFSupport
        }
      ) => {
        const isExisted = await Coins.findOne({ id });
        if (!!isExisted)
          throw new Error(i18n.__('coin.mutation.error.existed'));

        const coin = new Coins({
          id,
          name,
          symbol,
          logo,
          minimum_withdrawal: minimumWithdrawal,
          minimum_deposit: minimumDeposit,
          fee_percentage: feePercentage,
          fee_fixed: feeFixed,
          is_compound_support: isCompoundSupport,
          contract_address: contractAddress,
          decimals,
          network,
          isPFSupport
        });
        await coin.save();
        return coin;
      }
    ),
    update_coin: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (
        _,
        {
          id,
          name,
          logo,
          symbol,
          minimumWithdrawal,
          minimumDeposit,
          feePercentage,
          feeFixed,
          isCompoundSupport,
          contractAddress,
          decimals,
          marginPercentage,
          isPFSupport
        }
      ) => {
        const coin = await Coins.findOne({ id });
        if (!coin) throw new Error(i18n.__('coin.mutation.error.not_found'));

        const newCoinValue = defaults(coin.toJSON(), {
          name,
          logo,
          symbol,
          minimum_withdrawal: minimumWithdrawal,
          minimum_deposit: minimumDeposit,
          fee_percentage: feePercentage,
          fee_fixed: feeFixed,
          is_compound_support: isCompoundSupport,
          updated_at: Date.now(),
          contract_address: contractAddress,
          decimals,
          margin_percentage: marginPercentage,
          is_pf_support: isPFSupport
        });
        await Coins.updateOne({ id }, newCoinValue);

        return newCoinValue;
      }
    ),
    update_coin_status: combineResolvers(
      checkAuthorization([SYS_ADMIN]),
      async (_, { id, action }, { currentUser }) => {
        const coin = await Coins.findOne({ id });
        if (!coin) throw new Error(i18n.__('coin.mutation.error.not_found'));

        await Coins.updateOne({ id }, { status: action });

        const newValue = await Coins.findOne({ id });

        const activity = new Activities({
          action: UPDATE_COIN_STATUS,
          data: {
            old_value: coin,
            new_value: newValue
          },
          created_by: currentUser.id
        });
        await activity.save();

        try {
          const cryptoLib = getCryptoLibExistsByCoinId(coin.id);
          cryptoLib.updateStatus(action === COIN_ACTIVE);
        } catch (e) {
          console.error(e);
        }

        return coin;
      }
    )
  }
};
