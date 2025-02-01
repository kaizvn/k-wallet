import { BlockCypherAPI } from '../../libs';
import { LTC_COIN_ID } from '../../graphql/enums/coinId';

const CHAIN = process.env.LTC_CHAIN || 'test3';

const IS_ENABLED = process.env.ENABLE_LTC || true;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_LTC || false;

const ltcAPI = new BlockCypherAPI({
  coin: LTC_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT
});

export default ltcAPI;
