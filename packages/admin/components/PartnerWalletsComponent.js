import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import {
  partnerWalletsSelector,
  getPartnerWallets
} from '../stores/WalletState';
import {
  WalletDetailsComponent,
  EmptyWalletMessageComponent
} from '@revtech/rev-shared/components';
import { Grid } from '@material-ui/core';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const { DisplayWalletDetailsCardComponent } = WalletDetailsComponent;

const connectToRedux = connect(
  createStructuredSelector({ ewallets: partnerWalletsSelector }),
  dispatch => ({
    getPartnerWallets: partnerId => dispatch(getPartnerWallets(partnerId))
  })
);

const enhance = compose(connectToRedux, withTranslation('common'));

class PartnerWalletsComponent extends React.Component {
  componentDidMount() {
    this.props.getPartnerWallets(this.props.partnerId);
  }
  render() {
    const { ewallets = [], t } = this.props;
    return (
      <Grid style={{ padding: '40px 0px' }} container spacing={3}>
        {!ewallets.length ? (
          <EmptyWalletMessageComponent>
            {t('rev_shared.message.partner_empty_ewallet')}
          </EmptyWalletMessageComponent>
        ) : (
          ewallets.map((wallet, index) => (
            <Grid style={{ flexGrow: 1 }} key={index} item sm={6} md={6} lg={4}>
              <DisplayWalletDetailsCardComponent ewallet={wallet} />
            </Grid>
          ))
        )}
      </Grid>
    );
  }
}

export default enhance(PartnerWalletsComponent);
