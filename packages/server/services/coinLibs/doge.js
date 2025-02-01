import { BlockCypherAPI } from '../../libs';
import { DOGE_COIN_ID } from '../../graphql/enums/coinId';

const CHAIN = process.env.DOGE_CHAIN || 'test3';

const IS_ENABLED = process.env.ENABLE_DOGE || true;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_DOGE || false;

const dogeAPI = new BlockCypherAPI({
  coin: DOGE_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT
});

export default dogeAPI;
