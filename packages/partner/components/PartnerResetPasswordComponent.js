import { ResetPasswordComponent } from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import {
  resetPassword,
  resetPasswordSuccessMessageSelector,
  resetPasswordErrorMessageSelector
} from '../stores/UserState';

import { checkTokenResetPassword } from '@revtech/rev-shared/apis/actions';
import { checkTokenResetPasswordErrorMessageSelector } from '@revtech/rev-shared/apis/selectors';

const connectToRedux = connect(
  createStructuredSelector({
    errorMessage: resetPasswordErrorMessageSelector,
    successMessage: resetPasswordSuccessMessageSelector,
    tokenError: checkTokenResetPasswordErrorMessageSelector
  }),
  dispatch => ({
    doResetPassword: (token, newPassword) =>
      newPassword && dispatch(resetPassword(token, newPassword)),
    checkToken: token => dispatch(checkTokenResetPassword(token))
  })
);

class PartnerChangePasswordComponent extends React.Component {
  componentWillMount() {
    const { initialValues, checkToken } = this.props;
    checkToken(initialValues.token);
  }

  render() {
    return <ResetPasswordComponent {...this.props} />;
  }
}
export default connectToRedux(PartnerChangePasswordComponent);
