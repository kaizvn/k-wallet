import React from 'react';
import { compose } from 'recompose';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import GeneralSettingComponent from '../../components/GeneralSettingComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import { Grid } from '@material-ui/core';
import AccountSettingComponent from '../../components/AccountSettingComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { currentUserSelector } from '../../stores/UserState';

const { ROLE_ADMIN } = ACCOUNT_ROLES;
const connectToRedux = connect(
  createStructuredSelector({
    userData: currentUserSelector
  })
);

const enhance = compose(
  AuthenHOC,
  withTranslation('admin-page-layout'),
  connectToRedux
);

const AdminSettingPage = ({ userData, ...rootProps }) => (
  <AdminPageLayout
    {...rootProps}
    isAppbarTitle={false}
    title={rootProps.t('page_header.settings.title')}
  >
    <Grid container spacing={3} justify="center">
      {(userData || {}).systemUserRole === ROLE_ADMIN && (
        <Grid style={{ flexGrow: 1 }} item md={12} lg={6}>
          <GeneralSettingComponent />
        </Grid>
      )}
      <Grid style={{ flexGrow: 1 }} item md={12} lg={6}>
        <AccountSettingComponent />
      </Grid>
    </Grid>
  </AdminPageLayout>
);
AdminSettingPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default enhance(AdminSettingPage);
