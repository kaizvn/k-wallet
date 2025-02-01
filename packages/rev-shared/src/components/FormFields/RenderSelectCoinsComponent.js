import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import {
  GetAllCoinsListSelector,
  getAllCoinsList
} from '../../stores/PaymentState';

const connectToRedux = connect(
  createStructuredSelector({
    coins: GetAllCoinsListSelector
  }),
  dispatch => ({
    getAllCoins: () => {
      dispatch(getAllCoinsList());
    }
  })
);

class RenderSelectCoinsComponent extends React.Component {
  componentWillMount() {
    this.props.getAllCoins();
  }
  render() {
    const {
      input,
      label,
      type,
      col,
      placeholder,
      meta: { touched, error }
    } = this.props;
    const { coins } = this.props;

    return (
      <div>
        {label && <label>{label}</label>}
        <div className="form-group row">
          <div className={`col-md-${col}`}>
            <select
              {...input}
              type={type}
              placeholder={placeholder}
              className="form-control"
            >
              <option selected hidden disabled value="">
                ---
              </option>

              {coins &&
                coins.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.symbol}
                  </option>
                ))}
            </select>
            {touched &&
              (error && <span style={{ color: 'red' }}>{error}</span>)}
          </div>
        </div>
      </div>
    );
  }
}

export default connectToRedux(RenderSelectCoinsComponent);
