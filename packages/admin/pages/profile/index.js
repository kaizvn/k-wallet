import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AdminProfileComponent from '../../components/AdminProfileComponent';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import { withTranslation } from '@revtech/rev-shared/i18n';

const ProfilePage = ({ t }) => (
  <AdminPageLayout
    isLoggedIn={true}
    isAppbarTitle={false}
    title={t('page_header.profile.index')}
  >
    <AdminProfileComponent />
  </AdminPageLayout>
);
ProfilePage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(ProfilePage));
