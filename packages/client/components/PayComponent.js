import { Button, RLink } from '@revtech/rev-shared/layouts';
import {
  DisplayErrorMessagesComponent,
  MissingInfoComponent,
  PaySendIconComponent,
  SuccessComponent
} from '@revtech/rev-shared/components';
import { STATUS } from '@revtech/rev-shared/enums';
import {
  allProductsSelector,
  payToPartnerErrorSelector,
  payToPartnerSuccessSelector,
  getPaidPartnerDetailsSelector
} from '@revtech/rev-shared/apis/selectors';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  getAllProducts,
  getPaidPartnerDetails
} from '@revtech/rev-shared/apis/actions';
import React from 'react';

import { upperCase } from 'lodash/fp';

import { currentUserSelector, payToPartnerByUser } from '../stores/UserState';
import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import PendingUserWarningComponent from './PendingUserWarningComponent';

const { U_PENDING } = STATUS;

const HEIAU_COIN_ID = 'heiau';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    ewallets: myWalletsSelector,
    partner: getPaidPartnerDetailsSelector,
    errorMessages: payToPartnerErrorSelector,
    success: payToPartnerSuccessSelector,
    products: allProductsSelector
  }),
  dispatch => ({
    getPaidPartnerDetails: data => dispatch(getPaidPartnerDetails(data)),
    payToPartner: (partnerId, product) => {
      const amount = product.price;
      const description = product.name;
      dispatch(
        payToPartnerByUser({
          coinId: HEIAU_COIN_ID,
          partnerId,
          amount,
          description
        })
      ); //payHeiau function
    },
    getMyEWallets: () => dispatch(getMyWallets()),
    getAllProducts: () => dispatch(getAllProducts())
  })
);

const withItemState = withState('item', 'setItem', '');
const withToggleConfirmationFormState = withState(
  'toggleConfirmationForm',
  'doToggleConfirmation',
  false
);
const enhance = compose(
  withToggleConfirmationFormState,
  withItemState,
  connectToRedux
);

class PayComponent extends React.Component {
  componentWillMount() {
    const { partnerId } = this.props;
    this.props.getPaidPartnerDetails({ partnerId });
    this.props.getMyEWallets();
    this.props.getAllProducts();
  }

  render() {
    const {
      currentUser,
      partner,
      products = [],
      item,
      setItem,
      payToPartner,
      ewallets = [],
      success,
      errorMessages
    } = this.props;

    let currentWallets = ewallets.length
      ? ewallets.find(wallet => wallet.coin.id === HEIAU_COIN_ID)
      : { balance: 0 };

    currentWallets = currentWallets || { balance: 0 };

    const options = products.map(prod => (
      <option key={prod.name} value={prod.name}>
        {prod.name}
      </option>
    ));

    return !partner ? (
      <MissingInfoComponent>
        <h4 className="text-danger mx-auto">
          The recipient does not exist or is banned. Please check again or
          contact owner for more information.
        </h4>
        <h5 className="text-center pt-3">
          <a href="/partner">Go to dashboard</a>
        </h5>
      </MissingInfoComponent>
    ) : (
      <div className="container-fluid">
        <div className="row bg-container">
          <div className="col-12">
            <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 text-center">
              <h3 className="title">REV.PAYMENT</h3>
              <div className="ks-description">Simplify your transaction</div>
              <PaySendIconComponent isPartner />
              <h4>{upperCase(partner.name)}</h4>
              <div className="badge badge-success">@{partner.partnerId}</div>
              <div />
              {currentUser.status === U_PENDING ? (
                <PendingUserWarningComponent currentUser={currentUser} />
              ) : success && success.id ? (
                <div className="ks-body col-md-6 offset-md-3">
                  <div>
                    <SuccessComponent title="Payment Completed!" />
                    <div className="mt-1 mb-1">
                      <RLink href="/partner">
                        <Button>Back to your dashboard </Button>
                      </RLink>
                    </div>
                  </div>
                </div>
              ) : (
                <React.Fragment>
                  <div className="row payment-label border-0 pt-2 pl-2 pr-2 mt-3">
                    <div className="col-12 col-md-6">
                      <div className="mb-4 text-left">
                        <label>{upperCase('drink')}</label>
                        <select
                          type="select"
                          className="form-control"
                          onChange={e => {
                            const item = products.find(
                              prod => prod.name === e.currentTarget.value
                            );
                            setItem(item);
                          }}
                        >
                          <option>Select your drink..</option>
                          {options}
                        </select>
                        {item && (
                          <div className=" mt-2 mb-2 d-flex justify-content-between">
                            <span className="ks-icon la la-coffee align-self-center" />
                            <span className="ks-text ml-2">{item.name} </span>
                            <span className="ks-amount ml-auto">
                              <strong> x 1</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-4 ">
                        <div className="summary">
                          {!item ? (
                            <h5 className="mt-4">
                              {upperCase('Transaction Details')}
                            </h5>
                          ) : (
                            <table style={{ width: '100%' }}>
                              <tbody>
                                {currentWallets && (
                                  <tr>
                                    <td className="text-left">
                                      <span className="text-secondary">
                                        Your Balance
                                      </span>
                                    </td>
                                    <td className="text-right">
                                      {currentWallets.balance || 0}
                                    </td>
                                  </tr>
                                )}

                                <tr>
                                  <td className="text-left">
                                    <span className="text-secondary">Cost</span>
                                  </td>
                                  <td className="text-right">
                                    {' '}
                                    - {item.price}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-left">
                                    <span className="text-secondary">
                                      Transaction Fee
                                    </span>
                                  </td>
                                  <td className="text-right">
                                    <span className="text-success">FREE!</span>
                                  </td>
                                </tr>
                                <tr>
                                  <td colSpan="2" className="spacer">
                                    <hr />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-left">
                                    <span className="text-primary">
                                      Subtotal
                                    </span>
                                  </td>
                                  <td className="ks-text-info text-right">
                                    HEI {item.price}
                                  </td>
                                </tr>
                                <tr>
                                  <td className="text-left">
                                    <span className="text-primary">
                                      Remain Balance
                                    </span>
                                  </td>
                                  <td className="ks-text-info text-right">
                                    {currentWallets.balance - item.price > 0 ? (
                                      `HEI ${currentWallets.balance -
                                        item.price}`
                                    ) : (
                                      <span className="text-danger ">
                                        insufficient balance
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                      <div className="mt-1">
                        <DisplayErrorMessagesComponent
                          messages={errorMessages}
                        />
                      </div>
                    </div>
                  </div>
                  <li className="row">
                    <div className="col-12 mb-2 ">
                      <React.Fragment>
                        {item && (
                          <div className="col-8 mb-2 offset-2">
                            <Button
                              disabled={
                                !item || currentWallets.balance - item.price < 0
                              }
                              onClick={() =>
                                payToPartner(partner.partnerId, item)
                              }
                            >
                              PAY
                            </Button>
                          </div>
                        )}
                      </React.Fragment>
                    </div>
                  </li>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <style jsx>{`
          .bg-container {
            min-height: 100vh;
            background-image: url('static/bg/bg-payment.png');
            background-size: cover;
          }
          .title {
            padding: 36px 0 6px 0;
            font-size: 24px;
          }
          .payment-label {
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.4);
          }
          .ks-icon {
            font-size: 24px;
          }
        `}</style>
      </div>
    );
  }
}
export default enhance(PayComponent);
