import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import { withTranslation } from '@revtech/rev-shared/i18n';

const ActivitiesPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.partner.activity')}
  >
    <div> underconstruction </div>
  </AdminPageLayout>
);
ActivitiesPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});
export default withTranslation('admin-page-layout')(AuthenHOC(ActivitiesPage));
