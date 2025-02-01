import React from 'react';

import {
  resetGetCurrentUser,
  resetRegisterPartnerUser
} from '../stores/UserState';
import { EmptyPageLayout } from '@revtech/rev-shared/layouts';
import LoginFormComponent from '../components/LoginFormComponent';

const LoginPage = () => (
  <EmptyPageLayout title="Login">
    <LoginFormComponent />
  </EmptyPageLayout>
);

LoginPage.getInitialProps = ctx => {
  const { store } = ctx || {};
  if (store) {
    resetRegisterPartnerUser(store.dispatch);
    resetGetCurrentUser(store.dispatch);
  }

  return { namespacesRequired: ['login-register'] };
};
export default LoginPage;
