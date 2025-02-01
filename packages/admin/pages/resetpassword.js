import React from 'react';

import AdminPageLayout from '../layouts/AdminPageLayout';
import AdminResetPasswordComponent from '../components/AdminResetPasswordComponent';

const AdminResetPasswordPage = ({ initialValues }) => (
  <AdminPageLayout title="Reset Password">
    <AdminResetPasswordComponent initialValues={initialValues} />
  </AdminPageLayout>
);

AdminResetPasswordPage.getInitialProps = ctx => {
  const {
    query: { token }
  } = ctx;
  return {
    initialValues: { token },
    namespacesRequired: []
  };
};

export default AdminResetPasswordPage;
