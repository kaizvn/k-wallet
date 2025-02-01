import React from 'react';

import HeaderComponent from './HeaderComponent';

const UserHeaderComponent = props => (
  <React.Fragment>
    <HeaderComponent {...props} />
  </React.Fragment>
);

export default UserHeaderComponent;
