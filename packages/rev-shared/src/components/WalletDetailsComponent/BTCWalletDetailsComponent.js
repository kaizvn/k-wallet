import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import WalletDetailsCardComponent from './WalletDetailsCardComponent';

const BTCWalletDetailsComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletDetailsCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.coin.btcColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default BTCWalletDetailsComponent;
