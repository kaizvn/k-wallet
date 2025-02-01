import React from 'react';

import PartnerPageLayout from '../layouts/PartnerPageLayout';
import { ForgotPasswordComponent } from '@revtech/rev-shared/components';
import {
  forgotPassword,
  forgotPasswordErrorMessageSelector,
  forgotPasswordSuccessMessageSelector
} from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: forgotPasswordErrorMessageSelector,
    successMessage: forgotPasswordSuccessMessageSelector
  }),
  dispatch => ({
    doGetEmail: email => email && dispatch(forgotPassword(email))
  })
);
const PartnerForgotPasswordPage = ({
  errorMessages,
  successMessage,
  doGetEmail
}) => {
  return (
    <PartnerPageLayout title="Forgot Password">
      <ForgotPasswordComponent
        errorMessages={errorMessages}
        successMessage={successMessage}
        doGetEmail={doGetEmail}
      />
    </PartnerPageLayout>
  );
};

PartnerForgotPasswordPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default connectToRedux(PartnerForgotPasswordPage);
