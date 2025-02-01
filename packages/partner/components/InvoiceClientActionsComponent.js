import { Button, InputText } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React, { useEffect, useState } from 'react';

import { Box, Grid, makeStyles } from '@material-ui/core';
import { currentUserSelector } from '../stores/UserState';
import {
  createNewClient,
  createNewClientErrorSelector,
  getInvoiceClientDetails,
  updateClient,
  invoiceClientDetailsDataSelector,
  updateClientErrorSelector,
  createNewClientResetter,
  updateClientResetter,
  invoiceClientDetailsResetter
} from '../stores/InvoiceState';
import { DisplayErrorMessagesComponent } from '@revtech/rev-shared/components';

const connetToRedux = connect(
  createStructuredSelector({
    currentUserData: currentUserSelector,
    createClientErrorMessages: createNewClientErrorSelector,
    invoiceClientDetailsData: invoiceClientDetailsDataSelector,
    updateClientErrorMessages: updateClientErrorSelector
  }),
  dispatch => ({
    createNewClient: objectValues => {
      dispatch(createNewClient(objectValues));
    },
    updateClient: objectValues => {
      dispatch(updateClient(objectValues));
    },
    getInvoiceClient: id => {
      dispatch(getInvoiceClientDetails(id));
    },
    resetData: () => {
      dispatch(createNewClientResetter);
      dispatch(updateClientResetter);
      dispatch(invoiceClientDetailsResetter);
    }
  })
);

const enhance = compose(connetToRedux, withTranslation('invoice'));

const useStyles = makeStyles(theme => ({
  label: {
    fontSize: 14
  },
  clientInputSection: {
    padding: theme.spacing(1, 0)
  },
  red: {
    color: 'red'
  }
}));

const InvoiceActionsComponent = ({
  currentUserData,
  createNewClient,
  onCancel,
  createClientErrorMessages,
  isUpdate = false,
  updateClient,
  invoiceClientId,
  invoiceClientDetailsData,
  getInvoiceClient,
  resetData,
  updateClientErrorMessages,
  t
}) => {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);

  useEffect(() => {
    if (!!invoiceClientDetailsData) {
      setName(invoiceClientDetailsData.name);
      setEmail(invoiceClientDetailsData.email);
    }
  }, [invoiceClientDetailsData]);

  useEffect(() => {
    if (isUpdate && invoiceClientId) {
      getInvoiceClient(invoiceClientId);
    }
  }, [invoiceClientId, isUpdate, getInvoiceClient]);

  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  if (!currentUserData) {
    return null;
  }

  return (
    <Grid container>
      <Grid className={classes.clientInputSection} item sm={12}>
        <div className={classes.label}>
          {t('invoice_client.label.name')}{' '}
          <span className={classes.red}> *</span>
        </div>
        <InputText
          error={errorName}
          value={name}
          onChange={value => setName(value)}
          size="small"
        />
      </Grid>
      <Grid className={classes.clientInputSection} item sm={12}>
        <div className={classes.label}>
          {t('invoice_client.label.email')}
          <span className={classes.red}> *</span>
        </div>
        <InputText
          error={errorEmail}
          value={email}
          onChange={value => setEmail(value)}
          size="small"
        />
      </Grid>

      <Box mt={2}>
        <Grid item sm={12}>
          <Grid container>
            <Grid item>
              <Button
                onClick={() => {
                  if (!name) {
                    setErrorName(true);
                  } else {
                    setErrorName(false);
                  }
                  if (!email) {
                    setErrorEmail(true);
                  } else {
                    setErrorEmail(false);
                  }
                  if (errorEmail || errorName) {
                    return;
                  }
                  !isUpdate
                    ? createNewClient({ name, email })
                    : updateClient({ id: invoiceClientId, name, email });
                }}
              >
                {t('invoice_client.button.save_change')}
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={onCancel} color="inherit">
                {t('invoice_client.button.cancel')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Grid item sm={12}>
        <DisplayErrorMessagesComponent messages={createClientErrorMessages} />
        <DisplayErrorMessagesComponent messages={updateClientErrorMessages} />
      </Grid>
    </Grid>
  );
};

export default enhance(InvoiceActionsComponent);
