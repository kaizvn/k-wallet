import React from 'react';

import UserPageLayout from '../../layouts/UserPageLayout';
import { ForgotPasswordComponent } from '@revtech/rev-shared/components';

import {
  forgotPassword,
  forgotPasswordErrorMessageSelector,
  forgotPasswordSuccessMessageSelector
} from '../../stores/UserState';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: forgotPasswordErrorMessageSelector,
    successMessage: forgotPasswordSuccessMessageSelector
  }),
  (dispatch) => ({
    doGetEmail: (email) => email && dispatch(forgotPassword(email))
  })
);

const enhance = compose(withTranslation('user-page-layout'), connectToRedux);

const UserForgotPasswordPage = ({
  errorMessages,
  successMessage,
  doGetEmail,
  t
}) => {
  return (
    <UserPageLayout title={t('page_header.user.forgot_password')}>
      <ForgotPasswordComponent
        errorMessages={errorMessages}
        successMessage={successMessage}
        doGetEmail={doGetEmail}
      />
    </UserPageLayout>
  );
};

UserForgotPasswordPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default enhance(UserForgotPasswordPage);
