import React from 'react';

import { getQuickFilterUsersList } from '../../stores/AdminState';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserManagementComponent from '../../components/UserManagementComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const ManagePage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.user.manage')}
    fetchData={getQuickFilterUsersList}
  >
    <UserManagementComponent />
  </AdminPageLayout>
);
ManagePage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(ManagePage));
