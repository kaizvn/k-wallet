import React from 'react';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  QrCodeComponent,
  AvatarComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  InputText,
  Button,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { doFunctionWithEnter } from '@revtech/rev-shared/utils';
import {
  verifyPassword,
  initSecretKey2FA,
  verifyAuthCode2FA,
  getStateEnable2FA,
  setStateEnable2FA
} from '@revtech/rev-shared/apis/actions';
import {
  verifyPasswordSelector,
  verifyPasswordErrorMessageSelector,
  initSecretKey2FASelector,
  verifyAuthCode2FAErrorMessageSelector,
  getStateEnable2FASelector
} from '@revtech/rev-shared/apis/selectors';
import {
  verifyPasswordAPIResetter,
  getStateEnable2FAAPIResetter,
  initSecretKey2FAAPIResetter
} from '@revtech/rev-shared/apis/resetters';
import { currentUserSelector } from '../stores/UserState';
import Router from 'next/router';
import { Grid, withStyles } from '@material-ui/core';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    isVerifyPassword: verifyPasswordSelector,
    verifyPasswordErrorMessage: verifyPasswordErrorMessageSelector,
    secretKey2FA: initSecretKey2FASelector,
    verifyAuthCode2FAErrorMessage: verifyAuthCode2FAErrorMessageSelector,
    isEnable2FA: getStateEnable2FASelector
  }),
  (dispatch) => ({
    initSecretKey2FA: () => dispatch(initSecretKey2FA()),
    verifyPassword: (password, callback) =>
      dispatch(verifyPassword(password, callback)),
    verifyAuthCode2FA: (authCode, callback) =>
      dispatch(verifyAuthCode2FA(authCode, callback)),
    getStateEnable2FA: () => dispatch(getStateEnable2FA()),
    setStateEnable2FA: (isEnable) => dispatch(setStateEnable2FA(isEnable)),
    resetData: () => {
      dispatch(verifyPasswordAPIResetter);
      dispatch(getStateEnable2FAAPIResetter);
      dispatch(initSecretKey2FAAPIResetter);
    }
  })
);

const withPasswordState = withState('password', 'setPassword', '');
const withAuthCodeState = withState('authCode', 'setAuthCode', '');
const styles = (theme) => ({
  input: {
    margin: theme.spacing(1, 0)
  }
});

const enhance = compose(
  connectToRedux,
  withPasswordState,
  withAuthCodeState,
  withTranslation('user'),
  withStyles(styles)
);

class TwoFactorAuthenComponent extends React.Component {
  componentDidMount() {
    this.props.initSecretKey2FA();
    this.props.getStateEnable2FA();
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const {
      currentUser,
      password,
      setPassword,
      verifyPassword,
      isVerifyPassword,
      verifyPasswordErrorMessage,
      verifyAuthCode2FA,
      authCode,
      setAuthCode,
      secretKey2FA,
      verifyAuthCode2FAErrorMessage,
      isEnable2FA,
      setStateEnable2FA,
      t,
      classes
    } = this.props;

    return (
      <Grid container justify="center">
        <Grid item xs={10} sm={10} md={4} className="shadow">
          <CardSimpleLayout
            header={
              <Grid container justify="center" alignItems="center">
                <h4>{t('two_factor_authen.title')}</h4>
              </Grid>
            }
            body={
              <Grid container justify="center">
                {isVerifyPassword && !isEnable2FA ? (
                  <div>
                    <Grid
                      container
                      justify="center"
                      direction="column"
                      alignItems="center"
                      style={{ textAlign: 'center' }}
                    >
                      <h3>{t('two_factor_authen.title_setup_tfa')}</h3>
                      <div>{t('two_factor_authen.message.scan_qr_code')}</div>
                    </Grid>
                    <QrCodeComponent text={secretKey2FA || ''} />
                    <div>
                      <InputText
                        size="small"
                        label={t('two_factor_authen.message.auth_type')}
                        value={authCode}
                        placeholder={t(
                          'two_factor_authen.placeholder_authen_code'
                        )}
                        onChange={(authCodeInput) => setAuthCode(authCodeInput)}
                        onKeyPress={(event) =>
                          doFunctionWithEnter(event, () =>
                            verifyAuthCode2FA(authCode, () => {
                              setStateEnable2FA(true);
                            })
                          )
                        }
                      />
                      {verifyAuthCode2FAErrorMessage && (
                        <DisplayErrorMessagesComponent
                          messages={verifyAuthCode2FAErrorMessage}
                        />
                      )}
                      <Grid container justify="center">
                        <Button
                          onClick={() =>
                            verifyAuthCode2FA(authCode, () => {
                              setStateEnable2FA(true);
                            })
                          }
                        >
                          {t('two_factor_authen.button.confirm')}
                        </Button>
                      </Grid>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Grid
                      container
                      justify="center"
                      direction="column"
                      alignItems="center"
                    >
                      <AvatarComponent url={currentUser.avatar} />
                      <h3>{currentUser.fullName}</h3>
                    </Grid>
                    <InputText
                      className={classes.input}
                      label={t('two_factor_authen.label.username')}
                      disabled
                      value={currentUser.username}
                    />
                    <InputText
                      className={classes.input}
                      label={t('two_factor_authen.label.password')}
                      type="password"
                      value={password}
                      onChange={(password) => setPassword(password)}
                      onKeyPress={(event) =>
                        doFunctionWithEnter(event, () => {
                          verifyPassword(password, () => {
                            if (isEnable2FA) {
                              setStateEnable2FA(false);
                            }
                          });
                        })
                      }
                      InputProps={{
                        autoComplete: 'new-password'
                      }}
                    />
                    {verifyPasswordErrorMessage && (
                      <DisplayErrorMessagesComponent
                        messages={verifyPasswordErrorMessage}
                      />
                    )}
                    <Grid container justify="center">
                      <Button
                        color="secondary"
                        onClick={() => Router.push('/user/profile')}
                      >
                        {t('two_factor_authen.button.cancel')}
                      </Button>
                      <Button
                        onClick={() =>
                          verifyPassword(password, () => {
                            if (isEnable2FA) {
                              setStateEnable2FA(false);
                            }
                          })
                        }
                      >
                        {t('two_factor_authen.button.confirm')}
                      </Button>
                    </Grid>
                  </div>
                )}
              </Grid>
            }
          />
        </Grid>
      </Grid>
    );
  }
}
export default enhance(TwoFactorAuthenComponent);
