import Button from '../layouts/Button';
import CardSimpleLayout from '../layouts/CardSimpleLayout';
import InputText from '../layouts/InputText';

import DisplayErrorMessagesComponent from '../components/DisplayErrorMessagesComponent';
import PasswordRecommendComponent from '../components/PasswordRecommendComponent';
import ReactPasswordStrengthComponent from '../components/ReactPasswordStrengthComponent';

import { withTranslation } from '../i18n';
import { doFunctionWithEnter } from '../utils';
import React, { useState, useEffect } from 'react';

import { Grid, makeStyles } from '@material-ui/core';
import { Done } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  label: {
    paddingTop: theme.spacing(2)
  },
  button: {
    paddingTop: theme.spacing(2)
  }
}));

const ChangePasswordComponent = ({
  doChangePassword,
  errorMessages,
  t,
  resetData = () => {}
}) => {
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');
  const [isMatch, setIsMatch] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid item xs={10} sm={10} md={8} lg={6} className="shadow">
        <CardSimpleLayout
          header={<h4>{t('change_password.title')}</h4>}
          body={
            <Grid container>
              <Grid item xs={12}>
                <label>{t('change_password.label.current_password')}</label>
              </Grid>
              <Grid item xs={12}>
                <InputText
                  id="current-password"
                  size="small"
                  type="password"
                  autoFocus
                  value={currentPassword}
                  onChange={value => setCurrentPassword(value)}
                />
              </Grid>
              <Grid item xs={12} className={classes.label}>
                <label>{t('change_password.label.new_password')}</label>
              </Grid>
              <Grid item xs={12}>
                <ReactPasswordStrengthComponent
                  minLength={6}
                  changeCallback={e => {
                    setIsValid(e.isValid);
                    e.isValid && setNewPassword(e.password);
                    setIsMatch(e.password === reNewPassword);
                  }}
                />
                <PasswordRecommendComponent />
              </Grid>
              <Grid item xs={12} className={classes.label}>
                <label>{t('change_password.label.re_new_password')}</label>
              </Grid>
              <Grid item xs={12}>
                <InputText
                  id="re-new-password"
                  value={reNewPassword}
                  size="small"
                  type="password"
                  onChange={value => {
                    setReNewPassword(value);
                    setIsMatch(value === newPassword);
                  }}
                  error={reNewPassword && !isMatch ? true : false}
                  onKeyPress={event =>
                    reNewPassword &&
                    isMatch &&
                    doFunctionWithEnter(event, () =>
                      doChangePassword(currentPassword, newPassword)
                    )
                  }
                  InputProps={{
                    endAdornment: reNewPassword && isMatch && (
                      <Done style={{ color: 'green' }} />
                    )
                  }}
                />
              </Grid>
              <Grid container justify="center" className={classes.button}>
                <Button
                  disabled={!(isMatch && isValid)}
                  onClick={e => {
                    e.preventDefault();
                    doChangePassword(currentPassword, newPassword);
                  }}
                >
                  {t('change_password.button.change_password')}
                </Button>
              </Grid>

              <Grid item xs={12}>
                {errorMessages && (
                  <DisplayErrorMessagesComponent messages={errorMessages} />
                )}
              </Grid>
            </Grid>
          }
        />
      </Grid>
    </Grid>
  );
};
export default withTranslation('common')(ChangePasswordComponent);
