import React from 'react';

const Alert = ({ title, color }) => (
  <div className={`alert alert-${color}`}>{title}</div>
);
export default Alert;
