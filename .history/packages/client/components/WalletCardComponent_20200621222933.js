import React from 'react';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const getFontAwesomeName = symbol => {
  if (symbol && symbol.toLowerCase() === 'eth') {
    return 'ethereum';
  }
  return symbol;
};

const WalletCardComponent = ({ ewallet }) => (
  <div className="wallet-items border-bottom">
    <div
      className={cx('wallet-card rounded-0 justify-content-start', {
        'ks-purple': !ewallet.coin.logo
      })}
    >
      <div className="icon-block">
        <span className="icon">
          {ewallet.coin.logo ? (
            <img src={ewallet.coin.logo} alt="" />
          ) : (
            <FontAwesomeIcon
              icon={['fab', getFontAwesomeName(ewallet.coin.symbol)]}
            />
          )}
        </span>
      </div>

      <div className="wallet-card-body">
        <div className="">
          <span className="balance">{ewallet.balance}</span>
        </div>
        <span className="badge badge-default"> {ewallet.coin.name}</span>
      </div>
    </div>

    <style jsx>{`
      .wallet-items {
        display: flex;
        flex: 1 auto;
        margin: 12px;
      }

      .ks-icon > img {
        max-width: 100%;
        height: auto;
      }

      .wallet-card {
        min-height: 124px;
        padding: 30px 20px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-orient: horizontal;
        flex-direction: row;
        border-color: #e5e5e5;
        flex-wrap: wrap;
      }
      .wallet-card .icon-block {
        background-color: #4e54a8;
        width: 64px;
        height: 64px;
        display: inline-flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        margin-right: 20px;
        border-radius: 32px;
      }
      .wallet-card .icon-block .icon {
        position: relative;
        color: #fff;
        font-size: 32px;
      }
      .wallet-card .icon-block .icon img {
        max-width: 100%;
        height: auto;
      }
      .wallet-card .balance {
        font-size: 24px;
        font-weight: 600;
        display: inline-block;
        margin-right: 16px;
      }
      .wallet-card .wallet-card-body {
        font-family: 'Montserrat', sans-serif;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
);

export default WalletCardComponent;
