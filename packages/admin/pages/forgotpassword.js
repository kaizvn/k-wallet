import React from 'react';
import AdminPageLayout from '../layouts/AdminPageLayout';
import { ForgotPasswordComponent } from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  forgotPassword,
  forgotPasswordErrorMessageSelector,
  forgotPasswordSuccessMessageSelector
} from '../stores/AdminState';

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: forgotPasswordErrorMessageSelector,
    successMessage: forgotPasswordSuccessMessageSelector
  }),
  dispatch => ({
    doGetEmail: email => email && dispatch(forgotPassword(email))
  })
);
const AdminForgotPasswordPage = ({
  errorMessages,
  successMessage,
  doGetEmail
}) => {
  return (
    <AdminPageLayout title="Forgot Password">
      <ForgotPasswordComponent
        errorMessages={errorMessages}
        successMessage={successMessage}
        doGetEmail={doGetEmail}
      />
    </AdminPageLayout>
  );
};

AdminForgotPasswordPage.getInitialProps = () => ({
  namespacesRequired: ['common']
});

export default connectToRedux(AdminForgotPasswordPage);
