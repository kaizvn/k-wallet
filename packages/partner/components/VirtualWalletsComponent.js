import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import {
  WalletDetailsComponent,
  EmptyWalletMessageComponent
} from '@revtech/rev-shared/components';
import { Grid } from '@material-ui/core';
const { DisplayWalletDetailsCardComponent } = WalletDetailsComponent;

const connectToRedux = connect(
  createStructuredSelector({
    ewallets: myWalletsSelector
  }),
  dispatch => ({
    getMyEWallets: () => {
      dispatch(getMyWallets());
    }
  })
);

class VirtualWalletsComponent extends React.Component {
  componentDidMount() {
    this.props.getMyEWallets();
  }
  render() {
    const { ewallets = [] } = this.props;
    return (
      <Grid container spacing={3}>
        {!ewallets.length ? (
          <EmptyWalletMessageComponent />
        ) : (
          ewallets.map((item, index) => (
            <Grid style={{ flexGrow: 1 }} key={index} item sm={6} md={6} lg={4}>
              <DisplayWalletDetailsCardComponent ewallet={item} key={index} />
            </Grid>
          ))
        )}
      </Grid>
    );
  }
}
export default connectToRedux(VirtualWalletsComponent);
