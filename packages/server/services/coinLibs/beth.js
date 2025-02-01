import { BETH_COIN_ID } from '../../graphql/enums/coinId';
import { BlockCypherAPI } from '../../libs';

const BETH_GAS_PRICE = 1e18;

const CHAIN = process.env.BETH_CHAIN;
const IS_ENABLED = process.env.ENABLE_BETH || false;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_BETH || false;

const bethAPI = new BlockCypherAPI({
  coin: BETH_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT,
  singleValue: BETH_GAS_PRICE,
  isEther: true
});

export default bethAPI;
