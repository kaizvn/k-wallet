import React from 'react';

import { getQuickFilterModeratorList } from '../../stores/AdminState';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import ModeratorManagementComponent from '../../components/ModeratorManagementComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const ManagePage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.moderator.manage')}
    fetchData={getQuickFilterModeratorList}
  >
    <ModeratorManagementComponent />
  </AdminPageLayout>
);
ManagePage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(ManagePage));
