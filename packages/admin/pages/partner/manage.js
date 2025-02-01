import React from 'react';

import { getQuickFilterPartnerList } from '../../stores/AdminState';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerManagementComponent from '../../components/PartnerManagementComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const ManagePage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.partner.manage')}
    fetchData={getQuickFilterPartnerList}
  >
    <PartnerManagementComponent />
  </AdminPageLayout>
);
ManagePage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(ManagePage));
