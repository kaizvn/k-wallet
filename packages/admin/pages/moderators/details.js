import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import ModeratorDetailsComponent from '../../components/ModeratorDetailsComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const DetailsPage = rootProps => {
  return (
    <AdminPageLayout
      {...rootProps}
      title={rootProps.t('page_header.moderator.details')}
    >
      <ModeratorDetailsComponent t={rootProps.t} />
    </AdminPageLayout>
  );
};
DetailsPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(DetailsPage));
