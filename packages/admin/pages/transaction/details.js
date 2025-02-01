import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';

const TransactionDetailsPage = rootProps => (
  <AdminPageLayout {...rootProps} title="Transaction Details">
    underconstruction
  </AdminPageLayout>
);

export default AuthenHOC(TransactionDetailsPage);
