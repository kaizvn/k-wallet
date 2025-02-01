import { DisplayCoinLogoComponent } from '@revtech/rev-shared/components';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect } from 'react';
import cx from 'classnames';

import { getAllCoinsSelector, getAllCoins } from '../stores/PaymentState';
import { useState } from 'react';
import {
  TextField,
  MenuItem,
  Grid,
  InputLabel,
  makeStyles
} from '@material-ui/core';
import { startCase } from 'lodash/fp';

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

const enhance = compose(connectToRedux);

const useStyles = makeStyles(theme => ({
  filled: {
    '& .MuiSelect-root': {
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 5px 10px rgba(30, 30, 32, 0.1)'
    },
    '& .MuiFilledInput-underline:before': {
      borderColor: `${theme.palette.common.white} !important`
    }
  },
  expandLabel: {
    '& .MuiSelect-root': {
      padding: '12px'
    }
  },
  label: {
    color: 'rgba(30, 30, 32, 0.85)',
    fontSize: '1.2rem',
    fontWeight: '600',
    padding: '0.5rem 0 0.25rem'
  }
}));

const revCoin = {
  id: 'rev',
  logo: '../static/assets/logo.png',
  name: 'Currency',
  symbol: 'Select coin'
};

const CoinListComponent = ({
  label,
  coins = [],
  col = 12,
  onChange,
  extraClassName = '',
  getAllCoins,
  variant = 'outlined',
  expandLabel = false,
  amount,
  wallets,
  ...props
}) => {
  const classes = useStyles();
  const [currentCoin, setCurrentCoin] = useState(revCoin);

  useEffect(() => {
    getAllCoins();
  }, [getAllCoins]);

  return (
    <Grid
      item
      md={col}
      sm={12}
      className={extraClassName}
      style={{ flexGrow: 1 }}
    >
      {expandLabel && (
        <InputLabel shrink color="primary" className={classes.label}>
          {label}
        </InputLabel>
      )}

      <TextField
        fullWidth
        id="outlined-select-coins"
        select
        margin="dense"
        label={!expandLabel ? label : ''}
        value={currentCoin.id}
        onChange={event => {
          const { value } = event.target;
          if (value === revCoin.id) {
            return;
          }
          onChange(event);
          const currentCoinSelected =
            coins.find(coin => coin.id === value) || {};
          setCurrentCoin(currentCoinSelected);
        }}
        variant={variant}
        className={cx(
          variant === 'filled' && classes.filled,
          expandLabel && classes.expandLabel
        )}
        {...props}
      >
        <MenuItem key={revCoin.id} value={revCoin.id}>
          <Grid container justify="flex-start" alignItems="center">
            <DisplayCoinLogoComponent coin={revCoin} small />
            <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
              {revCoin.symbol}
            </span>
          </Grid>
        </MenuItem>
        {coins.map(coin => (
          <MenuItem key={coin.id} value={coin.id}>
            <Grid container justify="flex-start" alignItems="center">
              <DisplayCoinLogoComponent coin={coin} small />
              <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
                {startCase(coin.name)} ({coin.symbol})
              </span>
            </Grid>
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  );
};

export default enhance(CoinListComponent);
