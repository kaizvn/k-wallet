import React from 'react';

import WalletDetailsCardComponent from './WalletDetailsCardComponent';
import { ThemeConsumer } from '../../layouts/Theme';

const HEIAUWalletDetailsComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletDetailsCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.coin.heiauColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default HEIAUWalletDetailsComponent;
