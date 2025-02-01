import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { userWalletsSelector, getUserWallets } from '../stores/WalletState';
import {
  WalletDetailsComponent,
  EmptyWalletMessageComponent
} from '@revtech/rev-shared/components';
import { Grid } from '@material-ui/core';
import { withTranslation } from '@revtech/rev-shared/i18n';
const { DisplayWalletDetailsCardComponent } = WalletDetailsComponent;
const connectToRedux = connect(
  createStructuredSelector({ ewallets: userWalletsSelector }),
  dispatch => ({
    getUserWallets: id => dispatch(getUserWallets(id))
  })
);
class UserWalletsComponent extends React.Component {
  componentDidMount() {
    this.props.getUserWallets(this.props.id);
  }
  render() {
    const { ewallets = [], t } = this.props;
    return (
      <Grid container spacing={3}>
        {!ewallets.length ? (
          <EmptyWalletMessageComponent>
            {t('rev_shared.message.empty_ewallet_user')}
          </EmptyWalletMessageComponent>
        ) : (
          ewallets.map((wallet, index) => (
            <Grid style={{ flexGrow: 1 }} key={index} item sm={6} md={6} lg={4}>
              <DisplayWalletDetailsCardComponent ewallet={wallet} key={index} />
            </Grid>
          ))
        )}
      </Grid>
    );
  }
}

export default connectToRedux(withTranslation('common')(UserWalletsComponent));
