import { upperCase } from 'lodash/fp';
import React from 'react';

import { BTC, ETH, HEIAU } from '../utils/coinType';
import BTCWalletComponent from './WalletComponent/BTCWalletComponent';
import DefaultWalletComponent from './WalletComponent/DefaultWalletComponent';
import ETHWalletComponent from './WalletComponent/ETHWalletComponent';
import HEIAUWalletComponent from './WalletComponent/HEIAUWalletComponent';

const DisplayWalletCardComponent = ({ ewallet }) => {
  if (!ewallet.coin) {
    return null;
  }
  switch (upperCase(ewallet.coin.symbol)) {
    case BTC:
      return <BTCWalletComponent ewallet={ewallet} />;
    case ETH:
      return <ETHWalletComponent ewallet={ewallet} />;
    case HEIAU:
      return <HEIAUWalletComponent ewallet={ewallet} />;
    default:
      return <DefaultWalletComponent ewallet={ewallet} />;
  }
};
export default DisplayWalletCardComponent;
