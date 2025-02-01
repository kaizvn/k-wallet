import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinLogoComponent from './CoinLogoComponent';

const ETHLogoComponent = ({ coin, sizeNumber }) => (
  <ThemeConsumer>
    {theme => (
      <CoinLogoComponent
        coin={coin}
        style={{
          backgroundColor: theme.coin.ethColor
        }}
        sizeNumber={sizeNumber}
      />
    )}
  </ThemeConsumer>
);
export default ETHLogoComponent;
