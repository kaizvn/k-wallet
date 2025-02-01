import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinLogoComponent from './CoinLogoComponent';

const DefaultCoinLogoComponent = ({ coin, sizeNumber }) => (
  <ThemeConsumer>
    {theme => (
      <CoinLogoComponent
        coin={coin}
        style={{
          backgroundColor: theme.primaryColor
        }}
        sizeNumber={sizeNumber}
      />
    )}
  </ThemeConsumer>
);
export default DefaultCoinLogoComponent;
