import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import EditAdminProfileComponent from '../../components/EditAdminProfileComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';
const EditPartnerProfilePage = ({ t, ...rootProps }) => (
  <AdminPageLayout {...rootProps} title={t('page_header.profile.edit')}>
    <EditAdminProfileComponent />
  </AdminPageLayout>
);

EditPartnerProfilePage.getInitialProps = async () => ({
  namespacesRequired: []
});

export default withTranslation(['admin-page-layout', 'common'])(
  AuthenHOC(EditPartnerProfilePage)
);
