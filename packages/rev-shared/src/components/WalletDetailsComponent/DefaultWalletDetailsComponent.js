import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import WalletDetailsCardComponent from './WalletDetailsCardComponent';

const DefaultWalletDetailsComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletDetailsCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.primaryColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default DefaultWalletDetailsComponent;
