import { BTC_COIN_ID } from '../../graphql/enums/coinId';
import { BlockCypherAPI } from '../../libs';

const CHAIN = process.env.BTC_CHAIN || 'test3';

const IS_ENABLED = process.env.ENABLE_BTC || true;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_BTC || true;

const btcAPI = new BlockCypherAPI({
  coin: BTC_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT
});

export default btcAPI;
