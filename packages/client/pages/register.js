import React from 'react';

import UserPageLayout from '../layouts/UserPageLayout';
import UserRegisterComponent from '../components/UserRegisterComponent';

const RegisterPage = ({ initialValues }) => {
  return (
    <UserPageLayout title="User Registration">
      <UserRegisterComponent initialValues={initialValues} />
    </UserPageLayout>
  );
};

RegisterPage.getInitialProps = (ctx) => {
  const {
    query: { email, partnerId, name }
  } = ctx;

  return {
    initialValues: {
      email,
      partnerId,
      partnerName: name
    },
    namespacesRequired: ['login-register']
  };
};

export default RegisterPage;
