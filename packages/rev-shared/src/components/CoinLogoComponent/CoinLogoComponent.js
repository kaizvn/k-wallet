import React, { Fragment } from 'react';
import { Avatar } from '@material-ui/core';

const CoinLogoComponent = ({ coin, style, sizeNumber }) => {
  const styleIcon = Object.assign(
    {},
    {
      width: `${sizeNumber}px`,
      height: `${sizeNumber}px`,
      borderRadius: '50%'
    },
    style
  );
  return (
    <Fragment>
      {coin.logo ? (
        <Avatar component="span" src={coin.logo} style={styleIcon} />
      ) : (
        <Avatar
          style={{
            width: `${sizeNumber}px`,
            height: `${sizeNumber}px`,
            borderRadius: '50%'
          }}
          component="span"
          src={`/static/images/icon-default.png`}
        />
      )}
    </Fragment>
  );
};

export default CoinLogoComponent;
