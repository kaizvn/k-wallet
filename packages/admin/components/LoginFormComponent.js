import { Button } from '@revtech/rev-shared/layouts';
import { DisplayErrorMessagesComponent } from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { loginErrorMessageSelector, loginSysUser } from '../stores/AdminState';
import { doFunctionWithEnter } from '@revtech/rev-shared/utils';
import {
  Grid,
  Typography,
  Container,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Box,
  withStyles
} from '@material-ui/core';
import Link from 'next/link';
import cx from 'classnames';

const withUsernameState = withState('username', 'setUsername', '');
const withPasswordState = withState('password', 'setPassword', '');

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: loginErrorMessageSelector
  }),
  dispatch => ({
    doLogin: (username, password) => dispatch(loginSysUser(username, password))
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
  withTranslation('login'),
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
          {t('header')}
        </Typography>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={cx(classes.paper, 'shadow')}>
            <Typography component="h1" variant="h6">
              {t('title')}
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                onChange={e => setUsername(e.currentTarget.value)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="input-group-icon-username"
                label={t('placeholder.username')}
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
                label={t('placeholder.password')}
                type="password"
                id="input-group-icon-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={t('label.remember_me')}
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
                {t('button.login')}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="/forgotpassword">
                    <a>{t('label.forgot_password')}</a>
                  </Link>
                </Grid>
              </Grid>
              <DisplayErrorMessagesComponent messages={errorMessages} />
            </form>
          </div>
          <Box className={classes.boxAtSmall} mt={30}>
            <Grid container justify="space-around">
              <span>© {t('label.copyright')}</span>
              <a href="#">{t('label.privacy_policy')}</a>
              <a href="#">{t('label.contact')}</a>
            </Grid>
          </Box>
        </Container>
      </Grid>
    );
  }
}

export default enhance(LoginFormComponent);
