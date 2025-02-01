import React from 'react';

import AdminCardDetailsComponent from '../components/AdminCardDetailsComponent';
import AdminPageLayout from '../layouts/AdminPageLayout';
import AuthenHOC from '../components/HOC/AuthenHOC';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid } from '@material-ui/core';

const DashboardPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.dashboard.title')}
  >
    <Grid container>
      <Grid item sm={12} md={6}>
        <AdminCardDetailsComponent />
      </Grid>
    </Grid>
  </AdminPageLayout>
);
DashboardPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout', 'dashboard']
});

export default withTranslation('admin-page-layout')(AuthenHOC(DashboardPage));
