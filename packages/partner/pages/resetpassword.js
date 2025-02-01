import React from 'react';

import PartnerPageLayout from '../layouts/PartnerPageLayout';
import PartnerResetPasswordComponent from '../components/PartnerResetPasswordComponent';

const PartnerResetPasswordPage = ({ initialValues }) => {
  return (
    <PartnerPageLayout title="Reset Password">
      <PartnerResetPasswordComponent initialValues={initialValues} />
    </PartnerPageLayout>
  );
};

PartnerResetPasswordPage.getInitialProps = ctx => {
  const {
    query: { token }
  } = ctx;
  return {
    initialValues: { token },
    namespacesRequired: []
  };
};

export default PartnerResetPasswordPage;
