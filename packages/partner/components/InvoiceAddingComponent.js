import {
  Button,
  CardSimpleLayout,
  InputText,
  AlertDialog
} from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { snakeCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { isValidEmail } from '@revtech/rev-shared/utils';
import { Grid, makeStyles, TextField } from '@material-ui/core';
import cx from 'classnames';
import { currentUserSelector } from '../stores/UserState';
import {
  createNewInvoice,
  getInvoiceClientsByCurrentUser,
  GetInvoiceClientsByCurrentUserDataSelector,
  getInvoiceClientsByCurrentUserResetter
} from '../stores/InvoiceState';
import ChipInput from 'material-ui-chip-input';
import { DatePicker } from '@material-ui/pickers';
import SelectLayout from '../layouts/SelectLayout';
import { APP_ACTIONS } from '@revtech/rev-shared/enums';
import InvoiceItemAddingComponent from './InvoiceItemAddingComponent';
import InvoiceCoinComponent from './InvoiceCoinComponent';
import Router from 'next/router';
import InvoiceDetailsComponent from './InvoiceDetailsComponent';
const { TOAST_ERROR, TOAST_SUCCESS } = APP_ACTIONS;

const connetToRedux = connect(
  createStructuredSelector({
    currentUserData: currentUserSelector,
    invoiceClientsData: GetInvoiceClientsByCurrentUserDataSelector
  }),
  dispatch => ({
    createNewInvoice: objectValues => {
      dispatch(createNewInvoice(objectValues));
    },
    getInvoiceClients: () => dispatch(getInvoiceClientsByCurrentUser()),
    displayToast: (message, type = TOAST_SUCCESS) =>
      dispatch({ type, payload: { message } }),
    resetData: () => dispatch(getInvoiceClientsByCurrentUserResetter)
  })
);

const enhance = compose(connetToRedux, withTranslation('invoice'));

const useStyles = makeStyles(theme => ({
  label: {
    padding: theme.spacing(1.5, 0, 1, 0),
    fontSize: 14
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    paddingTop: theme.spacing(2)
  },
  invoiceItems: {
    margin: theme.spacing(2, 0)
  },
  invoiceNote: {
    padding: theme.spacing(3, 5)
  }
}));

const defaultItemObject = {
  id: new Date().getTime(),
  name: '',
  desc: '',
  quantity: 0,
  price: 0,
  amount: 0
};

const validateValueItems = itemData => {
  for (const item of itemData) {
    if (!item.name || !item.quantity || !item.price) {
      return false;
    }
  }
  return true;
};

const getInvoiceId = partnerName =>
  partnerName ? `${snakeCase(partnerName)}_${new Date().getTime()}` : null;

let clientSelectOptions = [];
const getTomorrowDate = () =>
  new Date(new Date().getTime() + 24 * 60 * 60 * 1000);

const formatPreviewData = ({
  totalAmount,
  note,
  dueDate,
  coinDataForTable,
  itemData,
  invoiceCode,
  toEmail
}) => {
  invoicePreviewObject.totalAmount = totalAmount;
  invoicePreviewObject.note = note;
  invoicePreviewObject.dueDate = dueDate;
  invoicePreviewObject.invoiceCoins = coinDataForTable.map(coin => ({
    coin: {
      name: coin.coin,
      symbol: coin.id
    },
    totalAmount: coin.total,
    depositAddress: 'XXX-XXX-XXX'
  }));
  invoicePreviewObject.invoiceItems = itemData;
  invoicePreviewObject.invoiceCode = invoiceCode;
  invoicePreviewObject.to = {
    email: toEmail
  };
};

let invoicePreviewObject = {
  totalAmount: 0,
  invoiceItems: [],
  invoiceCoins: [],
  note: '',
  dueDate: null
};

const InvoiceAddingComponent = ({
  currentUserData,
  createNewInvoice,
  getInvoiceClients,
  invoiceClientsData,
  displayToast,
  setCurrentTab,
  t,
  resetData
}) => {
  const clientId = Router.query.clientId;
  const partnerInfo = currentUserData.partner || {};

  const classes = useStyles();
  const [itemData, setItemData] = useState([{ ...defaultItemObject }]);
  const [invoiceCode, setInvoiceCode] = useState(
    getInvoiceId(partnerInfo.name)
  );
  const [carbonCopy, setCarbonCopy] = useState([]);
  const [toEmail, setToEmail] = useState('');
  const [dueDate, setDueDate] = useState(getTomorrowDate());
  const [note, setNote] = useState('');
  const [errorClient, setErrorClient] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [coinDataForTable, setCoinDataForTable] = useState([]);
  const [isOpenPreview, setIsOpenPreview] = useState(false);

  useEffect(() => {
    const totalAmount = itemData.reduce(
      (prev, current) => prev + current.amount,
      0
    );
    setTotalAmount(totalAmount);
  }, [itemData]);
  useEffect(() => {
    return () => {
      Router.push(
        {
          pathname: '/invoice',
          query: {}
        },
        undefined,
        { shallow: true }
      );
    };
  }, []);

  useEffect(() => {
    getInvoiceClients();
  }, [getInvoiceClients]);

  useEffect(() => {
    if (clientId && invoiceClientsData) {
      const client = invoiceClientsData.find(client => client.id === clientId);
      if (client) {
        setToEmail(client.id);
      }
    }
  }, [clientId, invoiceClientsData]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  if (!!invoiceClientsData) {
    clientSelectOptions = invoiceClientsData.map(client => {
      return {
        label: client.name,
        value: client.id
      };
    });
  }

  if (!currentUserData) {
    return null;
  }

  return (
    <Grid container justify="center">
      <AlertDialog
        onClose={() => setIsOpenPreview(false)}
        fullWidth
        size="md"
        isOpenDialog={isOpenPreview}
        setIsOpenDialog={setIsOpenPreview}
        isFooter={false}
        content={
          isOpenPreview && (
            <InvoiceDetailsComponent
              invoiceMockData={invoicePreviewObject}
              noShadow
            />
          )
        }
      />
      <Grid xl={10} lg={12} md={12} sm={12} item className="shadow">
        <CardSimpleLayout
          bodyStyle={{
            padding: '24px 40px'
          }}
          body={
            <Grid>
              <div className={classes.title}>
                {t('invoice.title.basic_info')}
              </div>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12}>
                  <div className={classes.label}>
                    {t('invoice.label.invoice_no')}
                  </div>
                  <InputText
                    value={invoiceCode}
                    onChange={value => setInvoiceCode(value)}
                    size="small"
                  />
                </Grid>
                <Grid item md={6} sm={12}>
                  <div className={classes.label}>
                    {t('invoice.label.due_date')}
                  </div>
                  <DatePicker
                    minDate={getTomorrowDate()}
                    inputFormat="DD/MM/YYYY"
                    value={dueDate}
                    onChange={date => setDueDate(date)}
                    renderInput={props => (
                      <TextField
                        helperText={<span>&nbsp;</span>}
                        {...props}
                        variant="outlined"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item md={6} sm={12}>
                  <div className={classes.title}>
                    {t('invoice.title.company_info')}
                  </div>
                  <div className={classes.label}>
                    {t('invoice.label.company_name')}
                  </div>
                  <InputText
                    size="small"
                    defaultValue={partnerInfo.name || ''}
                    InputProps={{
                      disabled: true
                    }}
                  />
                  <div className={classes.label}>
                    {t('invoice.label.company_address')}
                  </div>
                  <InputText
                    size="small"
                    defaultValue={partnerInfo.address || ''}
                    InputProps={{
                      disabled: true
                    }}
                  />
                  <div className={classes.label}>
                    {t('invoice.label.email')}
                  </div>
                  <InputText
                    size="small"
                    defaultValue={partnerInfo.email || ''}
                    InputProps={{
                      disabled: true
                    }}
                  />
                  <div className={classes.label}>
                    {t('invoice.label.phone')}
                  </div>
                  <InputText
                    size="small"
                    defaultValue={partnerInfo.phone || ''}
                    InputProps={{
                      disabled: true
                    }}
                  />
                </Grid>
                <Grid item md={6} sm={12}>
                  <div className={classes.title}>
                    {t('invoice.title.recipients')}
                  </div>
                  <div className={classes.label}>
                    {t('invoice.label.bill_to')}:
                  </div>
                  {clientSelectOptions.length <= 0 ? (
                    <Button onClick={() => setCurrentTab(2)}>
                      Create new Client
                    </Button>
                  ) : (
                    <SelectLayout
                      error={errorClient}
                      value={toEmail}
                      onChange={event => {
                        setToEmail(event.target.value);
                      }}
                      formControlProps={{
                        fullWidth: true,
                        style: { margin: 0 }
                      }}
                      style={{ width: 'auto' }}
                      fullWidth
                      options={clientSelectOptions}
                    />
                  )}
                  <div className={classes.label}>CC:</div>
                  <ChipInput
                    onBeforeAdd={value => {
                      if (isValidEmail(value)) {
                        return true;
                      } else {
                        return false;
                      }
                    }}
                    onChange={value => {
                      setCarbonCopy(value);
                    }}
                    blurBehavior="add"
                    dataSource={carbonCopy}
                    size="small"
                    helperText={t('invoice.label.cc_note')}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          }
        />
      </Grid>

      <InvoiceItemAddingComponent
        itemData={itemData}
        setItemData={setItemData}
        totalAmount={totalAmount}
      />
      <InvoiceCoinComponent
        coinDataForTable={coinDataForTable}
        setCoinDataForTable={setCoinDataForTable}
        totalAmount={totalAmount}
      />
      <Grid
        xl={10}
        lg={12}
        md={12}
        sm={12}
        item
        className={cx('shadow', classes.invoiceItems, classes.invoiceNote)}
      >
        <div className={classes.label}>{t('invoice.label.note')}:</div>
        <TextField
          value={note}
          onChange={event => setNote(event.target.value)}
          fullWidth
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xl={10} lg={12} md={12}>
        <Grid container>
          <Grid item>
            <Button
              disabled={
                !toEmail || !validateValueItems(itemData) ? true : false
              }
              onClick={() => {
                const to =
                  (invoiceClientsData || []).find(
                    client => client.id === toEmail
                  ) || {};
                formatPreviewData({
                  totalAmount,
                  note,
                  dueDate,
                  coinDataForTable,
                  itemData,
                  invoiceCode,
                  toEmail: to.email
                });
                setIsOpenPreview(true);
              }}
              size="large"
            >
              {t('invoice.button.preview')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              disabled={
                !toEmail || !validateValueItems(itemData) ? true : false
              }
              onClick={() => {
                if (!toEmail) {
                  setErrorClient(true);
                } else {
                  setErrorClient(false);
                }
                if (!toEmail || !validateValueItems(itemData)) {
                  displayToast('Please fill correct data', TOAST_ERROR);
                } else {
                  createNewInvoice({
                    invoiceCode,
                    note: note,
                    toId: toEmail,
                    carbonCopy,
                    items: itemData.map(item => ({
                      name: item.name,
                      description: item.desc,
                      quantity: item.quantity,
                      price: item.price
                    })),
                    coins: coinDataForTable.map(coin => ({
                      coinId: coin.id,
                      subTotal: parseFloat(coin.subTotal)
                    })),
                    dueDate
                  });
                }
              }}
              size="large"
            >
              {t('invoice.button.send_invoice')}
            </Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => setCurrentTab(0)}
              color="inherit"
              size="large"
            >
              {t('invoice.button.cancel')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default enhance(InvoiceAddingComponent);
