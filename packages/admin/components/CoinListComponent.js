import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { getAllCoinsSelector, getAllCoins } from '../stores/PaymentState';

const connectToRedux = connect(
  createStructuredSelector({
    coins: getAllCoinsSelector
  }),
  dispatch => ({
    getAllCoins: () => {
      dispatch(getAllCoins());
    }
  })
);

class CoinListComponent extends React.Component {
  componentWillMount() {
    this.props.getAllCoins();
  }

  render() {
    const { label, coins, col = 12, onChange, placeholder } = this.props;
    return (
      <div className={`col-md-${col}`}>
        {label && <label>{label}</label>}
        <select
          defaultValue=""
          onChange={onChange}
          placeholder={placeholder}
          type="select"
          className="form-control"
        >
          <option disabled value="">
            {label ? label : '-----'}
          </option>

          {coins &&
            coins.map(item => (
              <option key={item.id} value={item.id}>
                {item.symbol}
              </option>
            ))}
        </select>
      </div>
    );
  }
}

export default connectToRedux(CoinListComponent);
