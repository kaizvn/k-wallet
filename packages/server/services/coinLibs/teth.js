import { EthereumWallet } from '../../libs';
import { TETH_COIN_ID } from '../../graphql/enums/coinId';

const CHAIN = process.env.TETH_CHAIN || 'rinkeby';

const IS_ENABLED = true;

const TETH = new EthereumWallet({
  coin: TETH_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  singleValue: 1e18
});

export default TETH;
