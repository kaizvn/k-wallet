import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinInfoComponent from './CoinInfoComponent';

const HEIAUCoinInfoComponent = ({ coin }) => (
  <ThemeConsumer>
    {theme => (
      <CoinInfoComponent
        coin={coin}
        style={{
          backgroundColor: theme.coin.heiauColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default HEIAUCoinInfoComponent;
