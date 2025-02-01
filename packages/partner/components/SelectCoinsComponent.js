import React from 'react';

class SelectCoinsComponent extends React.Component {
  render() {
    const {
      label,
      col = 12,
      onChange,
      placeholder,
      noFrame,
      wallets
    } = this.props;

    const options = (wallets || []).map(
      wallet =>
        wallet.coin && {
          label: wallet.coin.name,
          value: wallet.coin.id
        }
    );

    return options && options.length ? (
      <div className={!noFrame ? `col-md-${col}` : ''}>
        {label && <label>{label}</label>}
        <select
          defaultValue=""
          onChange={onChange}
          placeholder={placeholder}
          type="select"
          className="form-control"
        >
          <option disabled value="">
            --Select wallets--
          </option>

          {options.map(item => (
            <option key={item.label} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    ) : (
      <div>you haven't any wallets.</div>
    );
  }
}

export default SelectCoinsComponent;
