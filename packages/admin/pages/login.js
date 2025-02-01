import React from 'react';

import { resetGetCurrentUser } from '../stores/UserState';

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
    resetGetCurrentUser(store.dispatch);
  }

  return { namespacesRequired: ['login'] };
};

export default LoginPage;
