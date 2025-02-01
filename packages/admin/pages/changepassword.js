import React from 'react';
import { compose } from 'recompose';
import AdminPageLayout from '../layouts/AdminPageLayout';
import AuthenHOC from '../components/HOC/AuthenHOC';
import { ChangePasswordComponent } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  resetAdminChangePasword,
  changePassword,
  changePasswordErrorMessageSelector
} from '../stores/AdminState';
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: changePasswordErrorMessageSelector
  }),
  dispatch => ({
    doChangePassword: (currentPassword, newPassword) =>
      currentPassword &&
      newPassword &&
      dispatch(changePassword(currentPassword, newPassword)),
    resetData: () => {
      resetAdminChangePasword(dispatch);
    }
  })
);
const enhance = compose(
  AuthenHOC,
  withTranslation('admin-page-layout'),
  connectToRedux
);

const ChangePasswordPage = ({
  errorMessages,
  doChangePassword,
  resetData,
  ...rootProps
}) => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.change_password.title')}
  >
    <ChangePasswordComponent
      errorMessages={errorMessages}
      doChangePassword={doChangePassword}
      resetData={resetData}
    />
  </AdminPageLayout>
);

ChangePasswordPage.getInitialProps = () => ({
  namespacesRequired: ['admin-page-layout']
});

export default enhance(ChangePasswordPage);
