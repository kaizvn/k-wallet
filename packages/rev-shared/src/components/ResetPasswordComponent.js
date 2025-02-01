import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import { doFunctionWithEnter } from '../utils';
import Button from '../layouts/Button';
import DisplayErrorMessagesComponent from './DisplayErrorMessagesComponent';
import DoSuccessComponent from './DoSuccessComponent';
import MissingInfoComponent from './MissingInfoComponent';
import PasswordCondition from './PasswordCondition';
import ReactPasswordStrengthComponent from './ReactPasswordStrengthComponent';
import { withTranslation } from '../i18n';
import CardSimpleLayout from '../layouts/CardSimpleLayout';
import { Grid, withStyles, Typography } from '@material-ui/core';
import InputText from '../../dist/layouts/InputText';
import { Done, ArrowBack } from '@material-ui/icons';
import RLink from '../layouts/RLink';
const withNewPasswordState = withState('newPassword', 'setNewPassword', '');
const withReNewPasswordState = withState(
  'reNewPassword',
  'setReNewPassword',
  ''
);
const withIsMatched = withState('isMatch', 'setIsMatch', false);
const withIsValidNewPassword = withState('isValid', 'setIsValid', false);

const styles = theme => ({
  label: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1)
  },
  button: {
    paddingTop: theme.spacing(2)
  }
});
const enhance = compose(
  withNewPasswordState,
  withReNewPasswordState,
  withIsMatched,
  withIsValidNewPassword,
  withTranslation('common'),
  withStyles(styles)
);

const ResetPasswordComponent = ({
  setNewPassword,
  newPassword,
  reNewPassword,
  setReNewPassword,
  setIsValid,
  isValid,
  setIsMatch,
  isMatch,
  doResetPassword,
  errorMessage,
  successMessage,
  initialValues,
  tokenError,
  t,
  classes
}) => {
  return (
    <div>
      {tokenError && tokenError.length ? (
        <MissingInfoComponent>
          <Typography variant="h4" color="secondary">
            {tokenError}
          </Typography>
          <RLink href="/">
            <Button startIcon={<ArrowBack />} variant="outlined">
              {t('rev_shared.reset_password.button.back_to_home')}
            </Button>
          </RLink>
        </MissingInfoComponent>
      ) : (
        <Grid container justify="center">
          <Grid item xs={10} sm={10} md={8} lg={6} className="shadow">
            <CardSimpleLayout
              header={
                <Typography variant="h5">
                  {t('rev_shared.reset_password.title')}
                </Typography>
              }
              body={
                successMessage ? (
                  <DoSuccessComponent message="Your password was resetted !" />
                ) : (
                  <Fragment>
                    <Grid item xs={12}>
                      <Typography variant="body2" className={classes.label}>
                        {t('rev_shared.reset_password.label.new_password')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <ReactPasswordStrengthComponent
                        minLength={8}
                        changeCallback={e => {
                          setIsValid(e.isValid);
                          e.isValid && setNewPassword(e.password);
                          setIsMatch(e.password === reNewPassword);
                        }}
                      />
                      <PasswordCondition />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" className={classes.label}>
                        {t('rev_shared.reset_password.label.re_new_password')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <InputText
                        value={reNewPassword}
                        type="password"
                        size="small"
                        onChange={value => {
                          setReNewPassword(value);
                          setIsMatch(value === newPassword);
                        }}
                        error={reNewPassword && !isMatch ? true : false}
                        onKeyPress={event =>
                          reNewPassword &&
                          isMatch &&
                          doFunctionWithEnter(event, () =>
                            doResetPassword(initialValues.token, newPassword)
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
                          doResetPassword(initialValues.token, newPassword);
                        }}
                      >
                        {t('rev_shared.reset_password.button.reset_password')}
                      </Button>
                    </Grid>
                    {errorMessage && (
                      <DisplayErrorMessagesComponent messages={errorMessage} />
                    )}
                  </Fragment>
                )
              }
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default enhance(ResetPasswordComponent);
