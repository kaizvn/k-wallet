import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import { withTranslation } from '@revtech/rev-shared/i18n';

const PermissionsPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.setting_permissions.title')}
  >
    <div> underconstruction </div>
  </AdminPageLayout>
);
PermissionsPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});
export default withTranslation('admin-page-layout')(AuthenHOC(PermissionsPage));
