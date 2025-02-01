import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import PartnerSettingComponent from '../../components/PartnerSettingComponent';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { currentUserSelector } from '../../stores/UserState';
import { Grid } from '@material-ui/core';
import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import PartnerAccountSettingComponent from '../../components/PartnerAccountSettingComponent';

const { ROLE_OWNER } = ACCOUNT_ROLES;

const connectToRedux = connect(
  createStructuredSelector({
    userData: currentUserSelector
  })
);
const enhance = compose(
  AuthenHOC,
  withTranslation('partner-page-layout'),
  connectToRedux
);

const PartnerSettingPage = ({ t, userData, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    title={t('page_header.settings.index')}
    isAppbarTitle={false}
  >
    <Grid container spacing={3} justify="center">
      {(userData || {}).partnerUserRole === ROLE_OWNER && (
        <Grid style={{ flexGrow: 1 }} item md={12} lg={6}>
          <PartnerSettingComponent />
        </Grid>
      )}
      <Grid style={{ flexGrow: 1 }} item md={12} lg={6}>
        <PartnerAccountSettingComponent />
      </Grid>
    </Grid>
  </PartnerPageLayout>
);
PartnerSettingPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(PartnerSettingPage);
