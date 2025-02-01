import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getFontAwesomeName = symbol => {
  if (symbol && symbol.toLowerCase() === 'eth') {
    return 'ethereum';
  }
  return symbol;
};

const CoinInfoComponent = ({ coin, style }) => (
  <div className="col d-flex flex-row align-items-center">
    <span className="icon-block justify-content-center m-2" style={style}>
      <span className="icon">
        {coin.logo ? (
          <img src={coin.logo} alt="" />
        ) : (
          <FontAwesomeIcon icon={['fab', getFontAwesomeName(coin.symbol)]} />
        )}
      </span>
    </span>
    <div className="d-flex flex-column ml-2">
      <span className="text-secondary">{coin.symbol}</span>
      <span>{coin.name}</span>
    </div>
    <style jsx>
      {`
        .icon-block {
          width: 48px;
          font-size: 24px;
          border-radius: 50%;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1),
            0 6px 6px rgba(0, 0, 0, 0.1);
          display: flex;
        }
        .icon {
          color: white;
          height: 48px;
        }
        .icon-block .icon img {
          max-width: 100%;
          height: auto;
          max-height: 48px;
          margin: auto;
          border-radius: 50%;
        }
      `}
    </style>
  </div>
);

export default CoinInfoComponent;
