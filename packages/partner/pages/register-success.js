import React from 'react';

import RegisterSuccessPageComponent from '../components/RegisterSuccessPageComponent';
import PartnerPageLayout from '../layouts/PartnerPageLayout';

const RegisterSuccessPage = () => (
  <PartnerPageLayout title="Register Success">
    <RegisterSuccessPageComponent />
  </PartnerPageLayout>
);

RegisterSuccessPage.getInitialProps = () => ({
  namespacesRequired: ['login-register']
});

export default RegisterSuccessPage;
