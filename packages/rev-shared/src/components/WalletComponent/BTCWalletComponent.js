import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import WalletCardComponent from './WalletCardComponent';

const BTCWalletComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.coin.btcColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default BTCWalletComponent;
