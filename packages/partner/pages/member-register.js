import React from 'react';

import MemberRegisterComponent from '../components/MemberRegisterComponent';
import PartnerPageLayout from '../layouts/PartnerPageLayout';

const RegisterPage = ({ initialValues }) => {
  return (
    <PartnerPageLayout title="Partner Member Registration">
      <MemberRegisterComponent initialValues={initialValues} />
    </PartnerPageLayout>
  );
};

RegisterPage.getInitialProps = ctx => {
  const {
    query: { email, partnerId, id }
  } = ctx;

  return {
    initialValues: {
      email,
      partnerId,
      id
    }
  };
};

export default RegisterPage;
