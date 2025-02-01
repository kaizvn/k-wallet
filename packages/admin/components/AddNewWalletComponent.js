import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { get } from 'lodash/fp';

import { createPartnerWalletsByAdmin } from '../stores/PartnerState';
import { createPartnerWalletErrorSelector } from '@revtech/rev-shared/apis/selectors';
import { currentPartnerSelector } from '../stores/UserState';
import { Button, InputText } from '@revtech/rev-shared/layouts';
import CoinListComponent from './CoinListComponent';

const connectToRedux = connect(
  createStructuredSelector({
    addState: get('addState'),
    currentPartner: currentPartnerSelector,
    errorMessage: createPartnerWalletErrorSelector
  }),
  dispatch => ({
    addNewWallet: item => {
      dispatch({
        type: 'ADD_NEW_WALLET',
        payload: {
          item
        }
      });
    },

    createPartnerWallets: (name, coinId, partnerId) => {
      dispatch(createPartnerWalletsByAdmin({ name, coinId, partnerId }));
    }
  })
);

const withCoinIdState = withState('coinId', 'setCoinId', '');
const withWalletNameState = withState('walletName', 'setWalletName', '');

const enhance = compose(
  withCoinIdState,
  withWalletNameState,
  connectToRedux
);

class AddNewWalletComponent extends React.Component {
  render() {
    const {
      addState,
      coinId,
      walletName,
      setCoinId,
      setWalletName,
      createPartnerWallets,
      currentPartner,
      errorMessage
    } = this.props;
    let exClassName = '';
    if (addState) {
      exClassName = 'ks-open';
    }
    return (
      <div className="add-new-wallet-component">
        <div className={`card-add-new-wallet ${exClassName}`}>
          <div className="row add-new-wallet">
            <h3 className="card-title title-add-new-wallet">Add New Wallet</h3>
          </div>

          <div className="row">
            <div className="col-sm-6">
              <CoinListComponent
                onChange={e => {
                  setCoinId(e.currentTarget.value);
                }}
                col="12"
                label="Currency"
              />
            </div>
            <div className="col-sm-6">
              <label className="col-sm-3">Name</label>
              <div className="col-sm-12">
                <InputText
                  className="form-control"
                  onChange={e => setWalletName(e)}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-7" />
            <div className="col-sm-4">
              <Button
                type="submit"
                onClick={() =>
                  createPartnerWallets(walletName, coinId, currentPartner.id)
                }
              >
                Add
              </Button>
            </div>
            {errorMessage && (
              <div>
                <span className="text-danger">{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default enhance(AddNewWalletComponent);
