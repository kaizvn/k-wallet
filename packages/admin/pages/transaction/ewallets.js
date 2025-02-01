import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import VirtualWalletsComponent from '../../components/VirtualWalletsComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const VirtualWalletsPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.wallets')}
  >
    <VirtualWalletsComponent />
  </AdminPageLayout>
);
VirtualWalletsPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout', 'react-table']
});

export default withTranslation('admin-page-layout')(
  AuthenHOC(VirtualWalletsPage)
);
