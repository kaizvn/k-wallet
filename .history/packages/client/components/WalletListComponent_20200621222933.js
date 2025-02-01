import { DisplayWalletsComponent } from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getbackUrl } from '@revtech/rev-shared/libs';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import { compose } from 'recompose';

import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import WalletInfoCardComponent from './WalletInfoCardComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const connectToRedux = connect(
  createStructuredSelector({
    currentUserEWallets: myWalletsSelector
  }),
  dispatch => ({
    getUserEwallets: () => {
      dispatch(getMyWallets());
    }
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation('user')
);

class WalletListComponent extends React.Component {
  componentWillMount() {
    this.props.getUserEwallets();
  }

  render() {
    const { currentUserEWallets = [], t } = this.props;
    return (
      <div className="ks-column ks-page">
        <div className="ks-page-content">
          <div className="container-fluid ks-rows-section">
            <div className="card card-outline-secondary mb-3 mt-2">
              <div className="card-header font-weight-bold">
                <div className="ks-controls">
                  <a href="#" className="ks-control ks-update">
                    <Link href={getbackUrl(Router.router.pathname, '')}>
                      <span className="btn btn-info ks-light">
                        <span className="la la-arrow-circle-o-left ks-color-light" />
                        {t('wallets.button.back')}
                      </span>
                    </Link>
                  </a>
                </div>
              </div>
              <div className="card-block">
                <div className="wallets-container">
                  <DisplayWalletsComponent
                    WalletComponent={WalletInfoCardComponent}
                    ewallets={currentUserEWallets}
                  />
                  <style jsx>{`
                    .wallets-container {
                      display: flex;
                      flex-flow: row wrap;
                    }
                  `}</style>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default enhance(WalletListComponent);
