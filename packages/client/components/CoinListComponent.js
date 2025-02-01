import { DisplayCoinLogoComponent } from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { getAllCoinsSelector, getAllCoins } from '../stores/PaymentState';

const connectToRedux = connect(
  createStructuredSelector({
    coins: getAllCoinsSelector
  }),
  (dispatch) => ({
    getAllCoins: () => {
      dispatch(getAllCoins());
    }
  })
);
const withCoinState = withState('coin', 'setCoin', {
  id: 'rev',
  logo: '../static/assets/logo.png',
  name: 'Currency',
  symbol: 'Select Coin'
});

const enhance = compose(withCoinState, connectToRedux);

class CoinListComponent extends React.Component {
  componentWillMount() {
    this.props.getAllCoins();
  }

  render() {
    const {
      label,
      coins = [],
      col = 12,
      onChange,
      coin,
      setCoin,
      extraClassName = ''
    } = this.props;
    return (
      <div className={`col-md-${col} ${extraClassName} d-flex flex-column`}>
        {label && <label>{label}</label>}
        <div className="btn-group dropdown custom-dropdown-block">
          <button
            type="button"
            className="btn dropdown-toggle px-3 toggle-dropdown-custom align-items-center  justify-content-start"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div className="d-flex justify-content-start align-items-center custom-display-currencies">
              <DisplayCoinLogoComponent coin={coin} small />
              <span className="ml-2 font-weight-bold">{coin.symbol}</span>
            </div>
          </button>
          <div
            className="col-md-12 dropdown-menu"
            aria-labelledby="dropdownMenuMenu"
          >
            {coins.map((item) => (
              <span
                className="dropdown-item"
                onClick={(e) => {
                  onChange(e);
                  setCoin(item);
                }}
                id={item.id}
                key={item.id}
              >
                {
                  <div className="d-flex justify-content-start align-items-center">
                    <DisplayCoinLogoComponent coin={item} small />
                    <span className="ml-2 font-weight-bold">{item.symbol}</span>
                  </div>
                }
              </span>
            ))}
          </div>
        </div>
        <style jsx>
          {`
            .custom-display-currencies {
              width: 100%;
            }
            .custom-dropdown-block {
              background-color: #fafafa;
            }
            .toggle-dropdown-custom {
              border: solid 1px #e8e8e8;
              width: 100%;
              color: black;
              background-color: #fafafa;
              padding: 0px;
            }
            .toggle-dropdown-custom:hover,
            .dropdown-item:hover {
              background-color: #e2e2e2;
              cursor: pointer;
            }
          `}
        </style>
      </div>
    );
  }
}

export default enhance(CoinListComponent);
