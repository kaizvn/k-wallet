import { BlockCypherAPI } from '../../libs';
import { DASH_COIN_ID } from '../../graphql/enums/coinId';

const CHAIN = process.env.DASH_CHAIN || 'test3';

const IS_ENABLED = process.env.ENABLE_DASH || true;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_DASH || true;

const dashAPI = new BlockCypherAPI({
  coin: DASH_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT
});

export default dashAPI;
