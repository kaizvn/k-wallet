import { upperCase } from 'lodash/fp';
import React from 'react';

import { BTC, ETH, HEIAU } from '../utils/coinType';
import BTCCoinInfoComponent from './CoinComponents/BTCCoinInfoComponent';
import DefaultCoinInfoComponent from './CoinComponents/DefaultCoinInfoComponent';
import ETHCoinInfoComponent from './CoinComponents/ETHCoinInfoComponent';
import HEIAUCoinInfoComponent from './CoinComponents/HEIAUCoinInfoComponent';

const DisplayCoinInfoComponent = ({ coin }) => {
  switch (upperCase(coin.symbol)) {
    case BTC:
      return <BTCCoinInfoComponent coin={coin} />;
    case ETH:
      return <ETHCoinInfoComponent coin={coin} />;
    case HEIAU:
      return <HEIAUCoinInfoComponent coin={coin} />;
    default:
      return <DefaultCoinInfoComponent coin={coin} />;
  }
};
export default DisplayCoinInfoComponent;
