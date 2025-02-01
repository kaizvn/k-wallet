import {
  CardSimpleLayout,
  ReactTableLayout
} from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React, { useEffect, useState } from 'react';
import { upperCase } from 'lodash';
import { Grid, makeStyles } from '@material-ui/core';
import cx from 'classnames';
import {
  getCoinDataNetwork,
  CoinNetWorkDataSelector
} from '../stores/InvoiceState';
import { getAllCoins, getAllCoinsSelector } from '../stores/PaymentState';
import { GETTING_RATE_INTERVAL, EXCHANGES } from '@revtech/rev-shared/utils';
const { convertUSDToCurrency } = EXCHANGES;

const connetToRedux = connect(
  createStructuredSelector({
    coinsData: getAllCoinsSelector,
    coinNetWorkData: CoinNetWorkDataSelector
  }),
  dispatch => ({
    getCoins: () => dispatch(getAllCoins()),
    getCoinDataNetWork: (names = []) => dispatch(getCoinDataNetwork(names))
  })
);

const enhance = compose(connetToRedux, withTranslation('invoice'));

const useStyles = makeStyles(theme => ({
  invoiceItems: {
    margin: theme.spacing(2, 0)
  }
}));

const coinBody = data => (
  <div style={{ textAlign: 'center', padding: '4px 0px' }}>{data}</div>
);
const coinBodyTotal = data => (
  <div style={{ textAlign: 'right', padding: '4px 0px' }}>{data}</div>
);

const headerStyle = {
  textAlign: 'center',
  fontSize: 14,
  fontWeight: 600,
  padding: `8px 0px`,
  fontStyle: 'normal',
  textTransform: 'capitalize'
};

const InvoiceCoinComponent = ({
  coinsData,
  getCoins,
  getCoinDataNetWork,
  coinNetWorkData,
  totalAmount,
  coinDataForTable,
  setCoinDataForTable,
  t
}) => {
  const classes = useStyles();
  const [startGetCoinNetwork, setStartGetCoinNetWork] = useState(false);

  useEffect(() => {
    if (totalAmount > 0) {
      setStartGetCoinNetWork(true);
    } else {
      setStartGetCoinNetWork(false);
    }
  }, [totalAmount]);

  useEffect(() => {
    let id;
    if (startGetCoinNetwork === true && !!coinsData) {
      const names = (coinsData || []).map(coin => coin.name);
      getCoinDataNetWork(names);
      id = setInterval(() => {
        const names = (coinsData || []).map(coin => coin.name);
        getCoinDataNetWork(names);
      }, GETTING_RATE_INTERVAL);
    }
    return () => clearInterval(id);
  }, [startGetCoinNetwork, coinsData, getCoinDataNetWork]);

  useEffect(() => {
    getCoins();
  }, [getCoins]);

  useEffect(() => {
    let result = [];
    if (!!coinNetWorkData && !!coinsData) {
      result = coinsData.map(coin => {
        const currentCoinNetwork =
          coinNetWorkData.find(coinNetwork => coinNetwork.symbol === coin.id) ||
          {};
        const subTotal = convertUSDToCurrency({
          amountUSD: totalAmount,
          currentPriceNetwork: currentCoinNetwork.current_price
        });
        const total = convertUSDToCurrency({
          amountUSD: totalAmount,
          currentPriceNetwork: currentCoinNetwork.current_price,
          marginPercentage: coin.marginPercentage
        });
        return {
          id: coin.id,
          coin: coin.name,
          subTotal,
          margin: coin.marginPercentage,
          total
        };
      });
    } else if (!!coinsData) {
      result = coinsData.map(coin => {
        return {
          id: coin.id,
          coin: coin.name,
          subTotal: 0,
          margin: coin.marginPercentage,
          total: 0
        };
      });
    }
    setCoinDataForTable(result);
  }, [coinsData, coinNetWorkData, totalAmount, setCoinDataForTable]);

  const COIN_COLUMNS = [
    {
      field: 'coin',
      title: t('invoice.table.coin.coin'),
      headerStyle: headerStyle
    },
    {
      field: 'subTotal',
      title: t('invoice.table.coin.sub_total'),
      headerStyle: headerStyle
    },
    {
      field: 'margin',
      title: t('invoice.table.coin.margin'),
      headerStyle: headerStyle
    },
    {
      field: 'total',
      title: t('invoice.table.coin.total'),
      headerStyle: Object.assign({}, headerStyle, { textAlign: 'right' })
    }
  ];

  return (
    <Grid
      xl={10}
      lg={12}
      md={12}
      sm={12}
      item
      className={cx('shadow', classes.invoiceItems)}
    >
      <CardSimpleLayout
        bodyStyle={{
          padding: 0
        }}
        body={
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ReactTableLayout
                data={coinDataForTable.map(coin => {
                  return {
                    coin: coinBody(coin.coin),
                    subTotal: coinBody(
                      `${coin.subTotal} ${upperCase(coin.id)}`
                    ),
                    margin: coinBody(`${coin.margin} %`),
                    total: coinBodyTotal(`${coin.total} ${upperCase(coin.id)}`)
                  };
                })}
                columns={COIN_COLUMNS}
                hasPaging={false}
                hasAction={false}
                style={{ padding: 0, boxShadow: 'none' }}
              />
            </Grid>
          </Grid>
        }
      />
    </Grid>
  );
};

export default enhance(InvoiceCoinComponent);
