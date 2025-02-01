import React from 'react';

import { resetGetCurrentUser } from '../stores/UserState';
import { EmptyPageLayout } from '@revtech/rev-shared/layouts';
import UserLoginFormComponent from '../components/UserLoginFormComponent';
const UserLogin = (rootProps) => (
  <EmptyPageLayout {...rootProps} background="bg-login" title="Login">
    <UserLoginFormComponent />
  </EmptyPageLayout>
);

UserLogin.getInitialProps = (ctx) => {
  const { store } = ctx || {};
  if (store) {
    resetGetCurrentUser(store.dispatch);
  }

  return { namespacesRequired: ['login-register'] };
};
export default UserLogin;
