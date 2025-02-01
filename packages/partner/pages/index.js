import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { DisplayWalletCardComponent } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';

import {
  currentPartnerSelector,
  currentUserSelector
} from '../stores/UserState';
import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import AuthenHOC from '../components/HOC/AuthenHOC';
import PartnerCardDetailsComponent from '../components/PartnerCardDetailsComponent';
import PartnerPageLayout from '../layouts/PartnerPageLayout';
import { Grid } from '@material-ui/core';
import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    currentPartner: currentPartnerSelector,
    partnerWallets: myWalletsSelector
  }),
  dispatch => ({
    getPartnerWallets: () => dispatch(getMyWallets())
  })
);

const { ROLE_OWNER } = ACCOUNT_ROLES;

const enhance = compose(
  AuthenHOC,
  connectToRedux,
  withTranslation(['partner-page-layout', 'dashboard'])
);

class DashboardPage extends React.Component {
  static async getInitialProps() {
    return {
      namespacesRequired: ['partner-page-layout', 'dashboard']
    };
  }
  componentDidMount() {
    this.props.getPartnerWallets();
  }
  render() {
    const {
      currentUser,
      currentPartner,
      partnerWallets = [],
      t,
      ...rootProps
    } = this.props;
    return (
      <PartnerPageLayout {...rootProps} title={t('page_header.dashboard')}>
        <Grid container spacing={3} justify="flex-start">
          <Grid item lg={4} md={6} sm={12}>
            <PartnerCardDetailsComponent
              currentPartner={currentPartner}
              currentUser={currentUser}
            />
          </Grid>
        </Grid>
        {(currentUser || {}).partnerUserRole === ROLE_OWNER && (
          <Grid style={{ padding: '16px 0px' }} container spacing={3}>
            {!partnerWallets.length
              ? null
              : partnerWallets.map((wallet, index) => (
                  <Grid
                    style={{ flexGrow: 1 }}
                    key={index}
                    item
                    sm={6}
                    md={6}
                    lg={4}
                  >
                    <DisplayWalletCardComponent ewallet={wallet} key={index} />
                  </Grid>
                ))}
          </Grid>
        )}
      </PartnerPageLayout>
    );
  }
}

export default enhance(DashboardPage);
