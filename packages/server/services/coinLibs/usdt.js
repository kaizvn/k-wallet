import { EthereumWallet } from '../../libs';
import { USDT_COIN_ID } from '../../graphql/enums/coinId';

const CHAIN = process.env.USDT_CHAIN || 'homestead';

const IS_ENABLED = process.env.ENABLE_USDT || true;

const USDT = new EthereumWallet({
  coin: USDT_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  singleValue: 1e6,
  contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' //main contract
});

export default USDT;
