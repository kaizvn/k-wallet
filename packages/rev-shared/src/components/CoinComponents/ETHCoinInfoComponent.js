import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinInfoComponent from './CoinInfoComponent';

const ETHCoinInfoComponent = ({ coin }) => (
  <ThemeConsumer>
    {theme => (
      <CoinInfoComponent
        coin={coin}
        style={{
          backgroundColor: theme.coin.ethColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default ETHCoinInfoComponent;
