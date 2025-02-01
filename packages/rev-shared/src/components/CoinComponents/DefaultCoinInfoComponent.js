import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import CoinInfoComponent from './CoinInfoComponent';

const DefaultCoinInfoComponent = ({ coin }) => (
  <ThemeConsumer>
    {theme => (
      <CoinInfoComponent
        coin={coin}
        style={{
          backgroundColor: theme.primaryColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default DefaultCoinInfoComponent;
