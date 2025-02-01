import { EthereumWallet } from '../../libs';
import { DAI_COIN_ID } from '../../graphql/enums/coinId';

const DAI_TO_ATTO = 1e18;

const CHAIN = process.env.DAI_CHAIN || 'rinkeby';
const IS_ENABLED = process.env.ENABLE_DAI || false;

const dai = new EthereumWallet({
  coin: DAI_COIN_ID,
  chain: CHAIN,
  isEnabled: IS_ENABLED,
  isPFSupport: false,
  singleValue: DAI_TO_ATTO,
  isEther: true
});

export default dai;
