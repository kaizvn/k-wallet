import { Button } from '@revtech/rev-shared/layouts';
import { DisplayErrorMessagesComponent } from '@revtech/rev-shared/components';
import { SOCIAL_TYPES } from '@revtech/rev-shared/enums';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { doFunctionWithEnter } from '@revtech/rev-shared/utils';
import React, { Fragment } from 'react';
import Router from 'next/router';

import {
  doLoginSocialNetwork,
  loginNormalUser,
  userLoginErrorMessageSelector,
  socialNetworkLoginErrorSelector,
  userLoginNormalSelector,
  resetUserLoginNormal
} from '../stores/UserState';
import {
  withStyles,
  Grid,
  Typography,
  Container,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  Divider
} from '@material-ui/core';
import Link from 'next/link';
import cx from 'classnames';
import { Facebook, Mail } from '@material-ui/icons';

const withUsernameState = withState('username', 'setUsername', '');
const withPasswordState = withState('password', 'setPassword', '');
const withCodeAuthState = withState('authCode', 'setAuthCode', '');
const withIsLoginBy2FAState = withState('isLoginBy2FA', 'setIsLoginBy2FA', '');

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: userLoginErrorMessageSelector,
    errorLoginSocial: socialNetworkLoginErrorSelector,
    userLoginNormal: userLoginNormalSelector
  }),
  (dispatch) => ({
    doLoginGoogle: () => {
      dispatch(doLoginSocialNetwork(SOCIAL_TYPES.GOOGLE, dispatch));
    },
    doLoginFacebook: () => {
      dispatch(doLoginSocialNetwork(SOCIAL_TYPES.FACEBOOK, dispatch));
    },
    doLogin: (username, password, authCode) =>
      username &&
      password &&
      dispatch(loginNormalUser(username, password, authCode)),
    linkToRegister: (e) => {
      e.preventDefault();
      Router.push('/register');
      dispatch({ type: 'LINK_TO_REGISTER' });
    },
    resetUserLoginNormal: () => resetUserLoginNormal(dispatch)
  })
);

const style = (theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3),
    background: 'white'
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
  },
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 1),
    background: 'white'
  },
  social: {
    padding: theme.spacing(1, 0)
  }
});

const enhance = compose(
  withUsernameState,
  withPasswordState,
  withCodeAuthState,
  withIsLoginBy2FAState,
  connectToRedux,
  withTranslation('login-register'),
  withStyles(style)
);

class UserLoginFormComponent extends React.Component {
  componentWillUnmount() {
    this.props.resetUserLoginNormal();
  }
  componentDidUpdate() {
    const { userLoginNormal, setIsLoginBy2FA } = this.props;

    if (userLoginNormal) setIsLoginBy2FA(userLoginNormal.isLoginBy2FA);
  }
  componentDidMount() {
    const usernameEle = document.getElementById('input-username');
    const passwordEle = document.getElementById('input-password');
    this.props.setUsername(usernameEle.value);
    this.props.setPassword(passwordEle.value);
  }
  render() {
    const {
      doLogin,
      doLoginGoogle,
      doLoginFacebook,
      username,
      password,
      setUsername,
      setPassword,
      errorLoginSocial,
      errorMessages,
      authCode,
      setAuthCode,
      isLoginBy2FA,
      t,
      classes
    } = this.props;

    return (
      <Fragment>
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          style={{ minHeight: '100vh' }}
        >
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={cx(classes.paper, 'shadow')}>
              <Typography component="h1" variant="h6">
                {t('login.title')}
              </Typography>
              <form className={classes.form} noValidate>
                <TextField
                  disabled={!!isLoginBy2FA}
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="input-username"
                  label={t('login.placeholder.username')}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                <TextField
                  disabled={!!isLoginBy2FA}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  onKeyPress={(event) =>
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
                  id="input-password"
                  InputLabelProps={{
                    shrink: true
                  }}
                />
                {isLoginBy2FA && (
                  <TextField
                    onChange={(e) => setAuthCode(e.currentTarget.value)}
                    onKeyPress={(event) =>
                      doFunctionWithEnter(event, () => {
                        event.preventDefault();
                        doLogin(username, password, authCode);
                      })
                    }
                    variant="outlined"
                    margin="dense"
                    fullWidth
                    label={t('login.placeholder.auth_code')}
                    id="input-login-by-2fa"
                    autoFocus
                  />
                )}

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
                  onClick={(e) => {
                    e.preventDefault();
                    doLogin(username, password, authCode);
                  }}
                >
                  {t('login.button.login')}
                </Button>
                <Grid container justify="center">
                  <p>
                    <span>{t('login.label.connect_with')}</span>
                  </p>
                </Grid>
                <Grid
                  container
                  justify="space-evenly"
                  className={classes.social}
                  spacing={2}
                >
                  <a
                    href=""
                    className="fb-btn"
                    onClick={async (e) => {
                      e.preventDefault();
                      doLoginGoogle();
                    }}
                  >
                    <Mail />
                    <Divider
                      orientation="vertical"
                      className={classes.divider}
                    />
                    <b>Google</b>
                  </a>
                  <a
                    href=""
                    className="gg-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      doLoginFacebook();
                    }}
                  >
                    <Facebook />
                    <Divider
                      orientation="vertical"
                      className={classes.divider}
                    />
                    <b>Facebook</b>
                  </a>
                </Grid>

                <div style={{ textAlign: 'center' }}>
                  <div>
                    <Link href="/user/forgotpassword">
                      <a>{t('login.label.forgot_password')}</a>
                    </Link>
                  </div>
                  <Link href="/register">
                    <a>{t('login.label.sign_up')}</a>
                  </Link>
                  <DisplayErrorMessagesComponent messages={errorMessages} />
                  {errorLoginSocial && (
                    <DisplayErrorMessagesComponent
                      messages={errorLoginSocial}
                    />
                  )}
                </div>
              </form>
            </div>
            <Box className={classes.boxAtSmall} mt={30}>
              <Grid container justify="space-around">
                <span style={{ color: 'white' }}>
                  © {t('login.label.copyright')}
                </span>
                <a href="#">{t('login.label.privacy_policy')}</a>
                <a href="#">{t('login.label.contact')}</a>
              </Grid>
            </Box>
          </Container>
          <style jsx>{`
            p {
              width: 100%;
              text-align: center;
              border-bottom: 1px solid #000;
              line-height: 0.1em;
              margin: 10px;
            }
            p span {
              background: #fff;
              padding: 0 10px;
              text-transform: uppercase;
            }
            .fb-btn {
              background: #ef5350;
              border: solid 1px #ef5350;
            }
            .gg-btn {
              background-color: #25628f;
              border: solid 1px #25628f;
            }
            .fb-btn,
            .gg-btn {
              display: flex;
              justify-content: flex-start;
              margin: 10px 0;
              font-size: 16px;
              border-radius: 2px;
              padding: 8px 26px;
              padding-left: 10px;
              color: #fff;
              align-items: center;
            }
          `}</style>
        </Grid>
      </Fragment>
    );
  }
}

export default enhance(UserLoginFormComponent);
