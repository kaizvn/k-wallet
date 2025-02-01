import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinLogoComponent from './CoinLogoComponent';

const BTCLogoComponent = ({ coin, sizeNumber }) => (
  <ThemeConsumer>
    {theme => (
      <CoinLogoComponent
        coin={coin}
        style={{
          backgroundColor: theme.coin.btcColor
        }}
        sizeNumber={sizeNumber}
      />
    )}
  </ThemeConsumer>
);
export default BTCLogoComponent;
