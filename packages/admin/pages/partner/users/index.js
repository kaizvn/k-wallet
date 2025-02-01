import React from 'react';

import { getQuickFilterPartnerUsersList } from '../../../stores/AdminState';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import AuthenHOC from '../../../components/HOC/AuthenHOC';
import PartnerUsersManagementComponent from '../../../components/PartnerUsersManagementComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';
const ManagePage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.partner.user.manage')}
    fetchData={getQuickFilterPartnerUsersList}
  >
    <PartnerUsersManagementComponent />
  </AdminPageLayout>
);
ManagePage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout', 'react-table']
});

export default withTranslation('admin-page-layout')(AuthenHOC(ManagePage));
