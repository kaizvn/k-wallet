import React from 'react';

const CountryIcon = ({ children }) => (
  <span className={`flag-icon flag-icon-${children}`} />
);

export default CountryIcon;
