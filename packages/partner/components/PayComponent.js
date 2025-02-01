import { Button } from '@revtech/rev-shared/layouts';
import {
  PaySendIconComponent,
  SuccessComponent,
  DisplayErrorMessagesComponent
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
import Link from 'next/link';
import React from 'react';
import {
  currentUserSelector,
  payToPartnerByPartner
} from '../stores/UserState';
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
        payToPartnerByPartner({
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
      <div />
    ) : (
      <div className="ks-nav-body-wrapper">
        <div className="ks-pricing-subscriptions-page">
          <div className="ks-header">
            <h3 className="ks-name">REV.PAYMENT</h3>
            <div className="ks-description">Simplify your transaction</div>
            <div className="ks-description">
              <PaySendIconComponent isPartner />
              <h5>{partner.name}</h5>
              <div>{partner.description}</div>
              <div className="badge badge-success">@{partner.partnerId}</div>
            </div>
          </div>
          <div className="ks-subscriptions">
            <div className="ks-subscription">
              <div className="ks-header">
                <span className="ks-name">Transaction Details</span>
              </div>
              <div className="ks-body">
                {currentUser.status === U_PENDING ? (
                  <PendingUserWarningComponent currentUser={currentUser} />
                ) : success && success.id ? (
                  <div>
                    <SuccessComponent title="Payment Completed!" />
                    <div className="back-button">
                      <Link href="/user">
                        <Button>Back to your profile </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className="item-select col-md-12">
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
                    </div>
                    <ul className="item-list">
                      {item && (
                        <li className="ks-item">
                          <span className="ks-icon la la-coffee" />
                          <span className="ks-text">{item.name} </span>
                          <span className="ks-amount"> x 1</span>
                        </li>
                      )}
                    </ul>
                    <div className="summary">
                      {item && (
                        <table>
                          <tbody>
                            {currentWallets && (
                              <tr>
                                <td>
                                  <span className="text-secondary">
                                    Your Balance
                                  </span>
                                </td>
                                <td>{currentWallets.balance || 0}</td>
                              </tr>
                            )}

                            <tr>
                              <td>
                                <span className="text-secondary">Cost</span>
                              </td>
                              <td> - {item.price}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-secondary">
                                  Transaction Fee
                                </span>
                              </td>
                              <td>
                                <span className="text-success">FREE!</span>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="2" className="spacer">
                                <hr />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-primary">Subtotal</span>
                              </td>
                              <td className="ks-text-info">HEI {item.price}</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="text-primary">
                                  Remain Balance
                                </span>
                              </td>
                              <td className="ks-text-info">
                                {currentWallets.balance - item.price > 0 ? (
                                  `HEI ${currentWallets.balance - item.price}`
                                ) : (
                                  <span className="text-danger">
                                    insufficient balance
                                  </span>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                    {item && (
                      <div className="pay-button">
                        <Button
                          disabled={
                            !item || currentWallets.balance - item.price < 0
                          }
                          onClick={() => payToPartner(partner.partnerId, item)}
                        >
                          PAY
                        </Button>
                        <div className="error-messages">
                          <DisplayErrorMessagesComponent
                            messages={errorMessages}
                          />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .ks-subscription > .ks-body > ul {
            margin-bottom: 12px;
          }
          .item-select {
            padding: 12px 0;
          }

          .ks-pricing-subscriptions-page > .ks-header {
            margin: 0px;
            padding: 12px 0;
          }

          .ks-pricing-subscriptions-page
            > .ks-subscriptions
            > .ks-subscription
            > .ks-header {
            padding: 12px;
          }

          .ks-pricing-subscriptions-page {
            padding-top: 0;
            padding-bottom: 0;
          }

          .ks-body {
            min-height: 400px;
          }

          .summary {
            float: right;
            padding-bottom: 12px;
            min-height: 120px;
          }

          .summary > table tr {
            padding-bottom: 6px;
          }

          .summary > table td:first-child {
            padding-top: 0;
            padding-right: 24px;
          }

          .summary > table td.spacer {
            padding: 0;
          }

          .summary > table td:last-child {
            text-align: right;
          }

          .item-list {
            min-height: 48px;
          }

          .error-messages {
            margin-top: 12px;
          }

          .back-button {
            margin: 6px 0;
          }
        `}</style>
      </div>
    );
  }
}
export default enhance(PayComponent);
