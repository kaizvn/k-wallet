import { upperCase } from 'lodash/fp';
import React from 'react';

import { BTC, ETH, HEIAU } from '../../utils/coinType';
import BTCWalletDetailsComponent from './BTCWalletDetailsComponent';
import DefaultWalletDetailsComponent from './DefaultWalletDetailsComponent';
import ETHWalletDetailsComponent from './ETHWalletDetailsComponent';
import HEIAUWalletDetailsComponent from './HEIAUWalletDetailsComponent';

const DisplayWalletDetailsCardComponent = ({ ewallet }) => {
  if (!ewallet.coin) {
    return null;
  }
  switch (upperCase(ewallet.coin.symbol)) {
    case BTC:
      return <BTCWalletDetailsComponent ewallet={ewallet} />;
    case ETH:
      return <ETHWalletDetailsComponent ewallet={ewallet} />;
    case HEIAU:
      return <HEIAUWalletDetailsComponent ewallet={ewallet} />;
    default:
      return <DefaultWalletDetailsComponent ewallet={ewallet} />;
  }
};
export default DisplayWalletDetailsCardComponent;
