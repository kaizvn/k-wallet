import { BlockCypherAPI } from '../../libs';
import { ETH_COIN_ID } from '../../graphql/enums/coinId';

const ETH_GAS_PRICE = 1e18;

const CHAIN = process.env.ETH_CHAIN || 'main';
const IS_ENABLED = process.env.ENABLE_ETH || false;
const IS_PF_SUPPORT = process.env.PF_SUPPORT_ETH || false;

const ethAPI = new BlockCypherAPI({
  coin: ETH_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: IS_PF_SUPPORT,
  singleValue: ETH_GAS_PRICE,
  isEther: true
});

export default ethAPI;
