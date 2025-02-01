import React from 'react';

import { ThemeConsumer } from '../../layouts/Theme';
import WalletCardComponent from './WalletCardComponent';

const DefaultWalletComponent = ({ ewallet }) => (
  <ThemeConsumer>
    {theme => (
      <WalletCardComponent
        ewallet={ewallet}
        style={{
          backgroundColor: theme.primaryColor
        }}
      />
    )}
  </ThemeConsumer>
);
export default DefaultWalletComponent;
