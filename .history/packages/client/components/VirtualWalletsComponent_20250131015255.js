import { Button } from '@revtech/rev-shared/layouts';
import { DropdownComponent } from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { get } from 'lodash/fp';
import React from 'react';

import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import AddNewWalletComponent from './AddNewWalletComponent';

const connectToRedux = connect(
  createStructuredSelector({
    ewallets: myWalletsSelector,
    addState: get('addState')
  }),
  (dispatch) => ({
    toggleFormWallet: (addState) => {
      dispatch({
        type: 'CALL_ADD_WALLET',
        payload: addState
      });
    },
    getMyEWallets: () => {
      dispatch(getMyWallets());
    }
  })
);
const items = ['Add', 'Edit', 'Delete'];

const WalletsItemComponent = ({ walletsItem, index }) => (
  <tr>
    <td>{++index}</td>
    <td>{walletsItem.coin.id}</td>
    <td>{walletsItem.name}</td>
    <td>{walletsItem.balance}</td>
    <td>{walletsItem.coin.symbol}</td>
    <td>
      <DropdownComponent items={items} />
    </td>
  </tr>
);

class VirtualWalletsComponent extends React.Component {
  componentWillMount() {
    this.props.getMyEWallets();
  }
  render() {
    const { addState, ewallets } = this.props;
    let exClassName = '';
    if (addState) {
      exClassName = 'ks-open';
    }
    return (
      <div className="ks-nav-body-wrapper relative-wallet-form">
        <div className="container-fluid ks-rows-section">
          <AddNewWalletComponent />
          <div className="row mt-5">
            <div className="col-lg-12 ks-tables-container">
              <div
                className={`card panel panel-default ks-information ks-light wallet-table ${exClassName}`}
              >
                <h5 className="card-header">
                  <span className="ks-text">Ewallets</span>
                  <Button onClick={() => this.props.toggleFormWallet(addState)}>
                    Add new Wallet
                  </Button>
                </h5>
                <div className="card-block ks-datatable">
                  <table
                    id="ks-sales-datatable"
                    className="table table-bordered"
                    width="100%"
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ewallets &&
                        ewallets.map((item, index) => (
                          <WalletsItemComponent
                            key={index}
                            index={index}
                            walletsItem={item}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connectToRedux(VirtualWalletsComponent);
