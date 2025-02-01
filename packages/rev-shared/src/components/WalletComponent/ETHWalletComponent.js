import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import WalletCardComponent from './WalletCardComponent';

const ETHWalletComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.coin.ethColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default ETHWalletComponent;
