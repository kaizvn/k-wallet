import React from 'react';

const Icon = ({ children, extraClass = 'ks-icon' }) => (
  <span className={`${extraClass} la la-${children}`} />
);

export default Icon;
