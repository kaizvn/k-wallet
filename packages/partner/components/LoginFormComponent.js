import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import Router from 'next/router';
import { withTranslation } from '@revtech/rev-shared/i18n';

import {
  partnerLoginErrorMessageSelector,
  loginPartnerUser
} from '../stores/PartnerState';
import { Button } from '@revtech/rev-shared/layouts';
import { doFunctionWithEnter } from '@revtech/rev-shared/utils';
import {
  Container,
  CssBaseline,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  withStyles,
  Box
} from '@material-ui/core';
import Link from 'next/link';
import cx from 'classnames';
import { DisplayErrorMessagesComponent } from '@revtech/rev-shared/components';

const withUsernameState = withState('username', 'setUsername', '');
const withPasswordState = withState('password', 'setPassword', '');

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: partnerLoginErrorMessageSelector
  }),
  dispatch => ({
    doLogin: (username, password) =>
      username && password && dispatch(loginPartnerUser(username, password)),
    linkToRegister: e => {
      e.preventDefault();
      Router.push('/register');
      dispatch({ type: 'LINK_TO_REGISTER' });
    }
  })
);

const style = theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3)
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  title: {
    color: '#25628f',
    marginBottom: theme.spacing(5),
    fontWeight: 700
  },
  boxAtSmall: {
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(2)
    }
  }
});
const enhance = compose(
  withUsernameState,
  withPasswordState,
  connectToRedux,
  withTranslation('login-register'),
  withStyles(style)
);

class LoginFormComponent extends React.Component {
  componentDidMount() {
    const usernameEle = document.getElementById('input-group-icon-username');
    const passwordEle = document.getElementById('input-group-icon-password');
    this.props.setUsername(usernameEle.value);
    this.props.setPassword(passwordEle.value);
  }
  render() {
    const {
      doLogin,
      linkToRegister,
      username,
      password,
      setUsername,
      setPassword,
      errorMessages,
      t,
      classes
    } = this.props;
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        direction="column"
        style={{ minHeight: '100vh' }}
      >
        <Typography className={classes.title} component="h1" variant="h4">
          {t('login.header')}
        </Typography>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={cx(classes.paper, 'shadow')}>
            <Typography component="h1" variant="h6">
              {t('login.title')}
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                onChange={e => setUsername(e.currentTarget.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="input-group-icon-username"
                label={t('login.placeholder.username')}
                autoFocus
              />
              <TextField
                onChange={e => setPassword(e.currentTarget.value)}
                onKeyPress={event =>
                  doFunctionWithEnter(event, () => {
                    event.preventDefault();
                    doLogin(username, password);
                  })
                }
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label={t('login.placeholder.password')}
                type="password"
                id="input-group-icon-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={t('login.label.remember_me')}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={e => {
                  e.preventDefault();
                  doLogin(username, password);
                }}
              >
                {t('login.button.login')}
              </Button>
              <div style={{ textAlign: 'center' }}>
                <div>
                  <Link href="/forgotpassword">
                    <a>{t('login.label.forgot_password')}</a>
                  </Link>
                </div>
                <div>
                  <Link href="/register">
                    <a onClick={linkToRegister}>{t('login.label.sign_up')}</a>
                  </Link>
                </div>
              </div>
              <DisplayErrorMessagesComponent messages={errorMessages} />
            </form>
          </div>
          <Box className={classes.boxAtSmall} mt={30}>
            <Grid container justify="space-around">
              <span>© {t('login.label.copyright')}</span>
              <a href="#">{t('login.label.privacy_policy')}</a>
              <a href="#">{t('login.label.contact')}</a>
            </Grid>
          </Box>
        </Container>
      </Grid>
    );
  }
}

export default enhance(LoginFormComponent);
