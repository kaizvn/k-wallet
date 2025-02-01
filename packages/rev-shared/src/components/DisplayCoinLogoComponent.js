import { upperCase } from 'lodash/fp';
import React from 'react';

import { BTC, ETH, HEIAU } from '../utils/coinType';
import BTCLogoComponent from './CoinLogoComponent/BTCLogoComponent';
import DefaultCoinLogoComponent from './CoinLogoComponent/DefaultCoinLogoComponent';
import ETHLogoComponent from './CoinLogoComponent/ETHLogoComponent';
import HEIAULogoComponent from './CoinLogoComponent/HEIAULogoComponent';

const getSizeNumberBySize = ({ small, medium, large }) => {
  switch (true) {
    case small:
      return 24;
    case medium:
      return 48;
    case large:
      return 100;
    default:
      return 48;
  }
};

const DisplayCoinLogoComponent = ({ coin, small, medium, large }) => {
  const sizeNumber = getSizeNumberBySize({ small, medium, large });
  switch (upperCase(coin.symbol)) {
    case BTC:
      return <BTCLogoComponent coin={coin} sizeNumber={sizeNumber} />;
    case ETH:
      return <ETHLogoComponent coin={coin} sizeNumber={sizeNumber} />;
    case HEIAU:
      return <HEIAULogoComponent coin={coin} sizeNumber={sizeNumber} />;
    default:
      return <DefaultCoinLogoComponent coin={coin} sizeNumber={sizeNumber} />;
  }
};

export default DisplayCoinLogoComponent;
