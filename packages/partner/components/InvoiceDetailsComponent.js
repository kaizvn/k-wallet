import { SimpleTableLayout } from '@revtech/rev-shared/layouts';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { DATE_FORMAT } from '@revtech/rev-shared/utils';
import {
  getInvoiceDetails,
  invoiceDetailsDataSelector
} from '../stores/InvoiceState';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { currentUserSelector } from '../stores/UserState';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { compose } from 'recompose';
import Moment from 'react-moment';

const connectToRedux = connect(
  createStructuredSelector({
    invoice: invoiceDetailsDataSelector,
    currentUserData: currentUserSelector
  }),
  dispatch => ({
    getInvoiceDetails: id => dispatch(getInvoiceDetails(id))
  })
);

const enhance = compose(connectToRedux, withTranslation(['invoice']));

const getDataInvoiceItem = (invoiceItems = []) =>
  invoiceItems.map(item => ({
    name: item.name,
    desc: item.description,
    quantity: item.quantity,
    price: `$ ${item.price}`,
    amount: `$ ${item.amount}`
  }));

const getDataInvoiceCoin = (invoiceCoins = [], classes) =>
  invoiceCoins.map(coin => ({
    coin: (coin.coin || {}).name,
    symbol: (coin.coin || {}).symbol,
    totalAmount: coin.totalAmount,
    address: <label className={classes.address}>{coin.depositAddress}</label>
  }));

const useStyles = makeStyles(theme => ({
  root: { margin: 'auto' },
  avatar: {},
  infoSection: {
    marginLeft: theme.spacing(2)
  },
  title: {
    fontWeight: 700,
    margin: theme.spacing(4, 0, 2, 0),
    fontSize: 18
  },
  address: {
    color: theme.palette.primary.main
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 700,
    padding: theme.spacing(2, 0)
  }
}));
let partner = {};
const InvoiceDetailsComponent = ({
  invoice,
  t,
  getInvoiceDetails,
  invoiceId,
  currentUserData,
  invoiceMockData = null,
  noShadow
}) => {
  const invoiceIdQuery = Router.query.id;
  const classes = useStyles();
  const [invoiceData, setInvoiceData] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const HEADER_ITEMS = [
    { field: 'name', title: t('details.table.item.name') },
    { field: 'desc', title: t('details.table.item.item_description') },
    {
      field: 'quantity',
      title: t('details.table.item.quantity'),
      align: 'right'
    },
    { field: 'price', title: t('details.table.item.price'), align: 'right' },
    { field: 'amount', title: t('details.table.item.amount'), align: 'right' }
  ];

  const HEADER_COINS = [
    { field: 'coin', title: t('details.table.address.coin'), width: '20%' },
    { field: 'symbol', title: t('details.table.address.symbol'), width: '20%' },
    {
      field: 'totalAmount',
      title: t('details.table.address.total_amount'),
      width: '20%'
    },
    {
      field: 'address',
      title: t('details.table.address.address'),
      width: '40%'
    }
  ];
  useEffect(() => {
    if (currentUserData) {
      partner = currentUserData.partner;
    }
  }, [currentUserData]);

  useEffect(() => {
    if (!invoiceMockData) {
      if (invoiceId) {
        getInvoiceDetails(invoiceId);
      } else if (invoiceIdQuery) {
        getInvoiceDetails(invoiceIdQuery);
      }
    }
  }, [getInvoiceDetails, invoiceId, invoiceIdQuery, invoiceMockData]);

  useEffect(() => {
    let totalAmount = 0;
    if (!!invoiceMockData) {
      totalAmount = invoiceMockData.invoiceItems.reduce((prev, current) => {
        return prev + current.quantity * current.price;
      }, 0);
      setInvoiceData(invoiceMockData);
    } else if (invoice) {
      totalAmount = invoice.invoiceItems.reduce((prev, current) => {
        return prev + current.quantity * current.price;
      }, 0);

      setInvoiceData(invoice);
    }
    setTotalAmount(totalAmount);
  }, [invoice, invoiceMockData]);

  return !invoiceData ? (
    <div />
  ) : (
    <Grid className={noShadow ? '' : 'shadow'} style={{ padding: '24px 0px' }}>
      <Grid className={classes.root} item lg={10} md={12}>
        <Grid container justify="center">
          <Typography>
            <b>{t('details.title.invoice')}</b>
          </Typography>
        </Grid>
        <Grid container justify="space-between">
          <Grid item>
            <Grid container direction="column">
              <Typography variant="button">
                <b>{partner.name}</b>
              </Typography>
              {partner.address && <div>{partner.address}</div>}
              <div>{partner.email}</div>
              <div>{partner.phone}</div>
            </Grid>
          </Grid>
          <Grid item style={{ textAlign: 'right' }}>
            <b>
              {t('details.label.invoice_code')}: {invoiceData.invoiceCode}
            </b>
            <div>
              {t('details.label.to')}: {(invoiceData.to || {}).email}
            </div>
            <div>
              {t('details.label.due_date')}:{' '}
              <Moment format={DATE_FORMAT}>{invoiceData.dueDate}</Moment>
            </div>
          </Grid>
        </Grid>
        <div className={classes.title}>{t('details.title.invoice_items')}</div>
        <SimpleTableLayout
          data={getDataInvoiceItem(invoiceData.invoiceItems || [])}
          columns={HEADER_ITEMS}
          noBorderHeader={true}
        />
        <Grid container justify="flex-end">
          <Typography className={classes.totalAmount} color="primary">
            {t('details.label.total')}: $ {totalAmount}.00
          </Typography>
        </Grid>
        <div className={classes.title}>
          {t('details.title.payment_address')}
        </div>
        <SimpleTableLayout
          data={getDataInvoiceCoin(invoiceData.invoiceCoins || [], classes)}
          columns={HEADER_COINS}
          noBorderHeader={true}
          noBorderBody={true}
        />
        <div className={classes.title}>{t('details.title.note')}</div>
        <div>{invoiceData.note || <i>{t('details.label.no_note')}</i>}</div>
      </Grid>
    </Grid>
  );
};

export default enhance(InvoiceDetailsComponent);
