import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinInfoComponent from './CoinInfoComponent';

const BTCCoinInfoComponent = ({ coin }) => (
  <ThemeConsumer>
    {theme => (
      <CoinInfoComponent
        coin={coin}
        style={{
          backgroundColor: theme.coin.btcColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default BTCCoinInfoComponent;
