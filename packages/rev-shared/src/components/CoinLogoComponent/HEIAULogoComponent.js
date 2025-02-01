import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinLogoComponent from './CoinLogoComponent';

const HEIAULogoComponent = ({ coin, sizeNumber }) => (
  <ThemeConsumer>
    {theme => (
      <CoinLogoComponent
        coin={coin}
        style={{
          backgroundColor: theme.coin.heiauColor
        }}
        sizeNumber={sizeNumber}
      />
    )}
  </ThemeConsumer>
);
export default HEIAULogoComponent;
