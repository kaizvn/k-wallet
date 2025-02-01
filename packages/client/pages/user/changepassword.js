import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import { ChangePasswordComponent } from '@revtech/rev-shared/components';
import UserPageLayout from '../../layouts/UserPageLayout';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  resetChangePasword,
  changePassword,
  changePasswordErrorMessageSelector
} from '../../stores/UserState';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid } from '@material-ui/core';
import { RLink, Button } from '@revtech/rev-shared/layouts';
import { getbackUrl } from '@revtech/rev-shared/libs';
import Router from 'next/router';
import { ArrowBackIos } from '@material-ui/icons';
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: changePasswordErrorMessageSelector
  }),
  (dispatch) => ({
    doChangePassword: (currentPassword, newPassword) =>
      currentPassword &&
      newPassword &&
      dispatch(changePassword(currentPassword, newPassword)),
    resetData: () => {
      resetChangePasword(dispatch);
    }
  })
);

const enhance = compose(
  AuthenHOC,
  connectToRedux,
  withTranslation(['user', 'user-page-layout'])
);

const UserChangePasswordPage = ({
  errorMessages,
  doChangePassword,
  resetData,
  t,
  ...rootProps
}) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.change_password')}>
    <Grid container>
      <Grid style={{ padding: '0px 0px 24px 24px' }} container>
        <RLink href={getbackUrl(Router.router.pathname, '')}>
          <Button startIcon={<ArrowBackIos />}>
            {t('profile.button.back')}
          </Button>
        </RLink>
      </Grid>
      <ChangePasswordComponent
        errorMessages={errorMessages}
        doChangePassword={doChangePassword}
        resetData={resetData}
      />
    </Grid>
  </UserPageLayout>
);

UserChangePasswordPage.getInitialProps = () => ({
  namespacesRequired: ['user']
});

export default enhance(UserChangePasswordPage);
