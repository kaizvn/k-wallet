import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserAddingComponent from '../../components/UserAddingComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const AddUserPage = rootProps => {
  return (
    <AdminPageLayout
      {...rootProps}
      title={rootProps.t('page_header.user.add_new')}
    >
      <UserAddingComponent />
    </AdminPageLayout>
  );
};
AddUserPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(AddUserPage));
