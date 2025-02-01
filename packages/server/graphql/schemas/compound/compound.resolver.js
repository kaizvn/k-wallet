import { path } from 'lodash/fp';

import {
  COMPOUND_SUPPLY,
  COMPOUND_BORROW,
  COMPOUND_STATUS_STARTED,
  COMPOUND_STATUS_ENDED
} from '../../enums/compoundTypes';
import { Coins } from '../../../services';

export default {
  CompoundRecord: {
    ownerId: path('owner_id'),
    currentRate: async ({ coin_id }) => {
      const coin = await Coins.findOne({ coin_id });
      return coin.compound_rate;
    },
    coinId: path('coin_id'),
    totalValue: ({ amount, interested_value }) => {
      return amount + interested_value;
    },
    interestValue: path('interested_value'),
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  },
  CompoundRate: {
    coinId: path('coin_id'),
    setBy: path('set_by'),
    createdAt: path('created_at'),
    updatedAt: path('updated_at')
  },
  CompoundType: {
    SUPPLY: COMPOUND_SUPPLY,
    BORROW: COMPOUND_BORROW
  },
  CompoundStatus: {
    STARTED: COMPOUND_STATUS_STARTED,
    ENDED: COMPOUND_STATUS_ENDED
  }
};
