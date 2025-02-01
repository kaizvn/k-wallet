import { BLOCKCYPHER_COIN_ID } from '../../graphql/enums/coinId';
import { BlockCypherAPI } from '../../libs';

const BLOCKCYPHER_NETWORK = process.env.BCY_CHAIN || 'test';

const IS_ENABLED = process.env.ENABLE_BCY || true;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_BCY || true;

const bcyAPI = new BlockCypherAPI({
  coin: BLOCKCYPHER_COIN_ID,
  chain: BLOCKCYPHER_NETWORK,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT,
  singleValue: 1e8
});

export default bcyAPI;
