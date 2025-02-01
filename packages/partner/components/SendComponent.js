import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';

import { sendToUserByPartner } from '../stores/PartnerState';
import { getReceivedUserDetails } from '@revtech/rev-shared/apis/actions';
import {
  getReceivedUserDetailsSelector,
  sendToUserErrorSelector,
  sendToUserSuccessSelector
} from '@revtech/rev-shared/apis/selectors';

import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import {
  SuccessComponent,
  PaySendIconComponent
} from '@revtech/rev-shared/components';
import { U_PENDING } from '../utils/status';
import { currentUserSelector } from '../stores/UserState';
import { isServer } from '@revtech/rev-shared/libs';
import { Button, InputText } from '@revtech/rev-shared/layouts';
import PendingUserWarningComponent from './PendingUserWarningComponent';
import SelectCoinsComponent from './SelectCoinsComponent';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    ewallets: myWalletsSelector,
    user: getReceivedUserDetailsSelector,
    errorMessage: sendToUserErrorSelector,
    successMessage: sendToUserSuccessSelector
  }),
  dispatch => ({
    getMyEWallets: () => {
      dispatch(getMyWallets());
    },
    getReceivedUserDetails: username =>
      dispatch(getReceivedUserDetails(username)),
    sendToUser: (coinId, partnerUsername, amount) => {
      dispatch(sendToUserByPartner({ coinId, partnerUsername, amount }));
    }
  })
);

const withAmountState = withState('amount', 'setAmount', '');
const withAvailableAmountState = withState(
  'availableAmount',
  'setAvailableAmount',
  ''
);
const withCoinIdState = withState('coinId', 'setCoinId', '');
const withToggleConfirmationFormState = withState(
  'toggleConfirmationForm',
  'doToggleConfirmation',
  false
);
const enhance = compose(
  withCoinIdState,
  withAvailableAmountState,
  withToggleConfirmationFormState,
  withAmountState,
  connectToRedux
);

class SendComponent extends React.Component {
  componentWillMount() {
    if (!isServer) {
      const { username } = Router.router.query;
      this.props.getReceivedUserDetails(username);
      this.props.getMyEWallets();
    }
  }

  render() {
    const {
      user,
      ewallets,
      amount,
      setAmount,
      errorMessage,
      successMessage,
      toggleConfirmationForm,
      doToggleConfirmation,
      availableAmount,
      setAvailableAmount,
      coinId,
      setCoinId,
      currentUser
    } = this.props;
    // const rows = [
    //   { label: 'Name', key: 'name' },
    //   { label: 'Email', key: 'email' }
    // ];
    // const displays = user && {
    //   name: user.fullName,
    //   email: user.email
    // };

    //TODO :
    // check input is partnerId or username , then add condition to check
    // PaySendIconComponent isPartner

    return !user ? (
      <div>
        <span className="text-danger">
          Your account is not available, please logged in or contact admin.
        </span>
      </div>
    ) : (
      <div className="card panel panel-default ks-light ks-panel">
        <div className="card-block wrapper">
          <div className="wrapper-inner">
            <PaySendIconComponent />
            <div className="container">
              <div className="row">
                <div className="user-info-card col-12 col-md-6 text-center offset-md-3 mb-3">
                  <div
                    className="card panel panel-default ks-light ks-solid"
                    style={{ height: '100%' }}
                  >
                    <h4 className="card-header">Customer Details</h4>
                    <div className="card-block">
                      <table className="user-details">
                        <tbody>
                          <tr>
                            <td className="text-right">Full name: </td>
                            <td className="text-left">
                              <strong>{user.fullName} </strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="text-right">Username: </td>
                            <td className="text-left">
                              <strong>{user.username}</strong>
                            </td>
                          </tr>

                          <tr>
                            <td className="text-right">Email: </td>
                            <td className="text-left">
                              <a href="#">
                                <strong>{user.email}</strong>
                              </a>
                            </td>
                          </tr>
                          {currentUser.status === U_PENDING && (
                            <tr>
                              <td className="text-danger" colSpan="2">
                                <PendingUserWarningComponent
                                  currentUser={currentUser}
                                />
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {currentUser.status === U_PENDING ? (
              <PendingUserWarningComponent currentUser={currentUser} />
            ) : successMessage && successMessage.id ? (
              <div className="ks-body col-md-6 offset-md-3">
                <div>
                  <SuccessComponent title="Send Completed!" />
                  <div className="back-button">
                    <Link href="/">
                      <Button>Back to your dashboard </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <React.Fragment>
                <div className="container">
                  <div className="row">
                    <div className="user-info-card col-12 col-md-6 text-center offset-md-3">
                      <div
                        className="card panel panel-default ks-light ks-solid"
                        style={{ height: '100%' }}
                      >
                        <div className="card-block mt-2">
                          <div className="card-text">
                            <span>
                              <strong>Paying for goods and services</strong>
                              <br />
                            </span>
                            The seller pays the fee, and your eligible purchase
                            are covered by our <a href="">Buyer Protection</a>
                          </div>
                        </div>

                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <div className="row">
                              <div className="col-md-4">
                                <span className="ks-text">Currency</span>
                              </div>
                              <div className="col-md-8">
                                <SelectCoinsComponent
                                  wallets={ewallets}
                                  onChange={e => {
                                    const walletByCoin =
                                      ewallets &&
                                      ewallets.find(
                                        item =>
                                          item.coin.id === e.currentTarget.value
                                      );
                                    setCoinId(
                                      walletByCoin && walletByCoin.coin.id
                                    );
                                    setAvailableAmount(walletByCoin.balance);
                                  }}
                                  noFrame="true"
                                />
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div className="row">
                              <div className="col-md-4">
                                <span className="ks-text">
                                  Available Amount:
                                </span>
                              </div>
                              <div className="col-md-8">
                                <strong>
                                  <h2>{availableAmount}</h2>
                                </strong>
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div className="row">
                              <div className="col-md-4">
                                <span className="ks-text">Amount</span>
                              </div>
                              <div className="col-md-8">
                                <InputText
                                  className="form-control"
                                  onChange={e => {
                                    setAmount(e);
                                  }}
                                  disabled={toggleConfirmationForm}
                                />
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div className="row">
                              {toggleConfirmationForm ? (
                                <React.Fragment>
                                  <div className="col-md-6 mb-2 ">
                                    <Button
                                      onClick={() =>
                                        this.props.sendToUser(
                                          coinId,
                                          user.username,
                                          parseFloat(amount)
                                        )
                                      }
                                    >
                                      Send Now
                                    </Button>
                                  </div>
                                  <div className="col-md-6 ">
                                    <Button
                                      danger
                                      onClick={() =>
                                        doToggleConfirmation(false)
                                      }
                                    >
                                      Back
                                    </Button>
                                  </div>
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  <div className="col-md-12">
                                    <Button
                                      onClick={() => doToggleConfirmation(true)}
                                    >
                                      Send
                                    </Button>
                                  </div>
                                </React.Fragment>
                              )}
                            </div>
                            {errorMessage && (
                              <div>
                                <span className="text-danger">
                                  {errorMessage}
                                </span>
                              </div>
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
        <style jsx>{`
            .card-text {
              font-size: 18px; !important
            }
            .back-button {
              margin-top: 12px;
            }
          `}</style>
      </div>
    );
  }
}
export default enhance(SendComponent);
