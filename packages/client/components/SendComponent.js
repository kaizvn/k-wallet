import { Button, InputText, RLink } from '@revtech/rev-shared/layouts';
import {
  DisplayErrorMessagesComponent,
  MissingInfoComponent,
  PaySendIconComponent,
  PopupComponent,
  SuccessComponent
} from '@revtech/rev-shared/components';
import { STATUS } from '@revtech/rev-shared/enums';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getReceivedUserDetails } from '@revtech/rev-shared/apis/actions';
import {
  getReceivedUserDetailsSelector,
  sendToUserErrorSelector,
  sendToUserSuccessSelector
} from '@revtech/rev-shared/apis/selectors';
import { isServer } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';
import Router from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { upperCase } from 'lodash/fp';

import { currentUserSelector } from '../stores/UserState';
import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import { sendToUserByUser } from '../stores/PartnerState';
import PendingUserWarningComponent from './PendingUserWarningComponent';
import SelectCoinsComponent from './SelectCoinsComponent';

const { U_PENDING } = STATUS;

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
      dispatch(sendToUserByUser({ coinId, partnerUsername, amount }));
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

const withIsOpenModalState = withState('isOpenModal', 'setIsOpenModal', false);

const enhance = compose(
  withCoinIdState,
  withAvailableAmountState,
  withAmountState,
  withIsOpenModalState,
  connectToRedux,
  withTranslation(['transfer', 'common'])
);

const NotEnoughBalanceComponent = ({ t }) => (
  <div className="col-12 col-md-10 offset-md-1">
    <div className="mb-4 text-center">
      <div className="text-center">
        <div className="text-danger p-3">
          {t('message.balance_insufficient')}
        </div>
      </div>
    </div>
  </div>
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
      availableAmount,
      setAvailableAmount,
      coinId,
      setCoinId,
      currentUser,
      sendToUser,
      isOpenModal,
      setIsOpenModal,
      t
    } = this.props;

    //TODO :
    // check input is partnerId or username , then add condition to check
    // PaySendIconComponent isPartner

    return !user ? (
      <MissingInfoComponent>
        <h4 className="text-danger mx-auto">
          {t('message.account_not_available')}
        </h4>
        <h5 className="text-center pt-3">
          <a href="/user">{t('message.go_to_dashboard')}</a>
        </h5>
      </MissingInfoComponent>
    ) : (
      <div className="container-fluid">
        <div className="row bg-container">
          <div className="content col-12">
            <div className="col-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 text-center">
              <PaySendIconComponent />
              <h4>{upperCase(user.fullName)}</h4>
              <a href="#">
                <FontAwesomeIcon icon={['fas', 'envelope']} />{' '}
                <strong>{user.email}</strong>
              </a>
              <h3 className="title">{t('title')}</h3>
              <div />
              {currentUser.status === U_PENDING ? (
                <PendingUserWarningComponent currentUser={currentUser} />
              ) : successMessage && successMessage.id ? (
                <div className="ks-body col-md-6 offset-md-3">
                  <div>
                    <SuccessComponent title="Send Completed!" />
                    <div>
                      <RLink href="/user">
                        <Button>{t('button.go_to_dashboard')} </Button>
                      </RLink>
                    </div>
                  </div>
                </div>
              ) : ewallets && ewallets.length === 0 ? (
                <div className="row payment-label pb-4 pt-4 border-0">
                  <h5 className="text-center mx-auto text-danger">
                    {t('message.do_not_have_wallet')}
                  </h5>
                </div>
              ) : (
                <React.Fragment>
                  <div className="row payment-label border-0 pt-4 pr-4 pl-4 pb-0">
                    <div className="col-12 col-md-6">
                      <div className="mb-4 text-left">
                        <label>{upperCase(t('label.currency'))}</label>
                        <SelectCoinsComponent
                          wallets={ewallets}
                          onChange={e => {
                            const walletByCoin =
                              ewallets &&
                              ewallets.find(
                                item => item.coin.id === e.currentTarget.value
                              );
                            setCoinId(walletByCoin && walletByCoin.coin.id);
                            setAvailableAmount(walletByCoin.balance);
                          }}
                          noFrame="true"
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="mb-4 text-left">
                        <label>{upperCase(t('label.amount'))}</label>
                        <InputText
                          placeholder={t('placeholder.amount')}
                          className="form-control"
                          onChange={e => {
                            setAmount(e);
                          }}
                        />
                      </div>
                    </div>
                    {availableAmount === 0 ? (
                      <NotEnoughBalanceComponent t={t} />
                    ) : (
                      availableAmount && (
                        <div className="col-12 col-md-10 offset-md-1 ">
                          <div className="mb-4 text-center">
                            <div className="text-center">
                              <div className="badge badge-pill badge-primary-outline available p-3">
                                {t('message.available_amount')}:{' '}
                                {availableAmount}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <li className="row">
                    <div className="col-8 offset-2 mb-2">
                      <Button
                        type="button"
                        onClick={() => setIsOpenModal(true)}
                      >
                        {t('button.send')}
                      </Button>
                      <PopupComponent
                        title={t('label.transfer_comfirmation')}
                        visible={isOpenModal}
                        setIsVisible={setIsOpenModal}
                        medium
                        onOk={() =>
                          sendToUser(coinId, user.username, parseFloat(amount))
                        }
                        okContent={<FontAwesomeIcon icon={['fas', 'check']} />}
                        onCancel={() => setIsOpenModal(false)}
                        cancelContent={t(
                          'common:rev_shared.popup.button.close'
                        )}
                      >
                        <React.Fragment>
                          <h4>
                            {t('label.send_to')}{' '}
                            <strong className="mb-2"> {user.username}</strong>
                          </h4>

                          {errorMessage && (
                            <div className="row">
                              <span className="text-danger">
                                <DisplayErrorMessagesComponent
                                  messages={errorMessage}
                                />
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      </PopupComponent>
                    </div>
                  </li>
                </React.Fragment>
              )}
            </div>
          </div>
          {currentUser.status === U_PENDING || (
            <div className="col-12 footer">
              <div className="col-12 col-sm-10 offset-sm-1 col-md-6 offset-md-3 text-center">
                <div className="card-block mt-2">
                  <div className="card-text">
                    <span>
                      <strong>{t('label.paying_for_goods')}</strong>
                      <br />
                    </span>
                    {t('label.covered_by_our')}{' '}
                    <a href="">{t('label.buyer_protection')}</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <style jsx>{`
          .uppercase {
            text-transform: uppercase;
          }
          .bg-container {
            min-height: 100vh;
            background-image: url('static/bg/bg-payment.png');
            background-size: cover;
          }
          .title {
            padding: 36px 0;
          }
          .available {
            font-size: 12px;
          }
          .payment-label {
            background-color: rgba(255, 255, 255, 1);
            box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.4);
          }
          .footer {
            background-color: rgba(0, 0, 0, 0.2);
            color: white;
          }
          .content {
            min-height: 80vh;
          }
        `}</style>
      </div>
    );
  }
}
export default enhance(SendComponent);
