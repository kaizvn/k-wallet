import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import WalletDetailsCardComponent from './WalletDetailsCardComponent';

const ETHWalletDetailsComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletDetailsCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.coin.ethColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default ETHWalletDetailsComponent;
