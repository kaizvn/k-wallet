import React from 'react';

const PwaLayout = ({ children }) => (
  <div>
    <link
      rel="stylesheet"
      type="text/css"
      href="/static/kosmo/assets/styles/pages/auth.min.css"
    />
    {children}
  </div>
);

export default PwaLayout;
