import React, { useState } from 'react';

import Button from '../layouts/Button';
import InputText from '../layouts/InputText';
import CardSimpleLayout from '../layouts/CardSimpleLayout';

import { withTranslation } from '../i18n';
import { doFunctionWithEnter } from '../utils';

import DisplayErrorMessagesComponent from './DisplayErrorMessagesComponent';
import DoSuccessComponent from './DoSuccessComponent';
import { Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(2, 1)
  }
}));

const ForgotPasswordComponent = ({
  doGetEmail,
  errorMessages,
  successMessage,
  t
}) => {
  const [email, setEmail] = useState();
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid item xs={10} sm={10} md={8} lg={6} className="shadow">
        <CardSimpleLayout
          header={
            <Typography variant="h5">{t('forgot_password.title')}</Typography>
          }
          body={
            successMessage ? (
              <DoSuccessComponent
                message={t('forgot_password.message.check_your_email')}
              />
            ) : (
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="body2" style={{ padding: 8 }}>
                    {t('forgot_password.label.input_email')}
                  </Typography>
                </Grid>
                <Grid item xs={12} className={classes.margin}>
                  <InputText
                    size="small"
                    type="email"
                    autoFocus
                    value={email}
                    onChange={setEmail}
                    onKeyPress={event =>
                      doFunctionWithEnter(event, () => doGetEmail(email))
                    }
                  />
                </Grid>
                <Grid container justify="center">
                  <Button
                    onClick={e => {
                      e.preventDefault();
                      doGetEmail(email);
                    }}
                  >
                    {t('forgot_password.button.get_email_confirm')}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  {errorMessages && (
                    <DisplayErrorMessagesComponent messages={errorMessages} />
                  )}
                </Grid>
              </Grid>
            )
          }
        />
      </Grid>
    </Grid>
  );
};
export default withTranslation('common')(ForgotPasswordComponent);
