import React from 'react';

import PartnerPageLayout from '../layouts/PartnerPageLayout';
import RegisterComponent from '../components/RegisterComponent';

const RegisterPage = ({ initialValues }) => {
  return (
    <PartnerPageLayout title="Partner Registration">
      <RegisterComponent initialValues={initialValues} />
    </PartnerPageLayout>
  );
};

RegisterPage.getInitialProps = ctx => {
  const {
    query: { email, id }
  } = ctx;

  return {
    initialValues: {
      email,
      id
    },
    namespacesRequired: ['login-register']
  };
};

export default RegisterPage;
