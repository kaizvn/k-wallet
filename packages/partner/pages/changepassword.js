import React from 'react';
import { compose } from 'recompose';
import AuthenHOC from '../components/HOC/AuthenHOC';
import { ChangePasswordComponent } from '@revtech/rev-shared/components';
import PartnerPageLayout from '../layouts/PartnerPageLayout';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  resetChangePasword,
  changePasswordErrorMessageSelector,
  changePassword
} from '../stores/UserState';

const connectToRedux = connect(
  createStructuredSelector({
    errorMessage: changePasswordErrorMessageSelector
  }),
  dispatch => ({
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
  withTranslation('partner-page-layout'),
  connectToRedux
);

const PartnerChangePasswordPage = ({
  t,
  errorMessages,
  doChangePassword,
  resetData
}) => (
  <PartnerPageLayout isLoggedIn={true} title={t('page_header.change_password')}>
    <ChangePasswordComponent
      errorMessages={errorMessages}
      doChangePassword={doChangePassword}
      resetData={resetData}
    />
  </PartnerPageLayout>
);

PartnerChangePasswordPage.getInitialProps = () => ({
  namespacesRequired: ['partner-page-layout']
});

export default enhance(PartnerChangePasswordPage);
