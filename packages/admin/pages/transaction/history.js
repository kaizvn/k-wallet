import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';

const HistoriesPage = rootProps => (
  <AdminPageLayout {...rootProps} title="Transaction History page">
    <div> underconstruction </div>
  </AdminPageLayout>
);

export default AuthenHOC(HistoriesPage);
