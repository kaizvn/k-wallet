import React from 'react';

import WalletCardComponent from './WalletCardComponent';
import { ThemeConsumer } from '../../layouts/Theme';

const HEIAUWalletComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.coin.heiauColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default HEIAUWalletComponent;
