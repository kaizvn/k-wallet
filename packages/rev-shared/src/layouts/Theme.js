import React from 'react';

const DEFAULT_THEME = {
  primaryColor: '#1976d2',
  successColor: '#4caf50',
  dangerColor: '#f44336',
  warningColor: '#ff9800',
  secondaryColor: '#d149cc',
  lightBlueColor: '#eff1fc',
  primaryClassName: 'royal-blue',
  secondaryClassName: 'fuchsia-pink',
  coin: {
    heiauColor: '#4e54a8',
    ethColor: '#81c159',
    btcColor: '#f88528'
  }
};

const Theme = React.createContext(DEFAULT_THEME);

export const ThemeProvider = ({ children, theme = DEFAULT_THEME }) => (
  <Theme.Provider value={theme}>{children}</Theme.Provider>
);

export const ThemeConsumer = Theme.Consumer;
