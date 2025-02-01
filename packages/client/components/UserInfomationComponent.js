import {
  DisplayErrorMessagesComponent,
  QrCodeComponent,
  EmptyDataComponent,
  DisplayWalletCardComponent,
  UserStatusComponent
} from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { objToQueryString } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React from 'react';

import { currentUserSelector, doLogout } from '../stores/UserState';
import {
  getQuickFilterBillsSelector,
  getQuickFilterBills
} from '../stores/BillingState';
import {
  getQuickFilterTransactionsErrorSelector,
  getQuickFilterTransactionsListSelector,
  getQuickFilterTransactionsList
} from '../stores/PartnerState';
import { getQuickFilterPaymentsList } from '@revtech/rev-shared/apis/actions';
import {
  getQuickFilterPaymentsListSelector,
  getQuickFilterPaymentsErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import DisplayBillsComponent from './DisplayBillsComponent';
import DisplayPaymentsComponent from './DisplayPaymentsComponent';
import DisplayTransactionsComponent from './DisplayTransactionsComponent';
import UserCardDetailsComponent from './UserCardDetailsComponent';

const connectToRedux = connect(
  createStructuredSelector({
    transactionsData: getQuickFilterTransactionsListSelector,
    paymentsData: getQuickFilterPaymentsListSelector,
    currentUser: currentUserSelector,
    currentUserEWallets: myWalletsSelector,
    getTransactionsErrorMessages: getQuickFilterTransactionsErrorSelector,
    getPaymentsErrorMessages: getQuickFilterPaymentsErrorSelector,
    billingData: getQuickFilterBillsSelector
  }),
  dispatch => ({
    getPaymentsList: () => {
      dispatch(getQuickFilterPaymentsList({}));
    },
    getTransactionsList: () => {
      dispatch(getQuickFilterTransactionsList({}));
    },
    getUserEwallets: () => {
      dispatch(getMyWallets());
    },
    logout: () => dispatch(doLogout()),
    getBillsList: () => {
      dispatch(getQuickFilterBills({}));
    }
  })
);

const createSendUrl = ({ username, userId }) =>
  `${process.env.DOMAIN_NAME}/transfer?${objToQueryString({
    username,
    userId
  })}`;

const MAX_DISPLAY_ITEMS = 3;

const withTransactionState = withState(
  'toggleTransactionState',
  'doToggleTransaction',
  'true'
);
const enhance = compose(
  withTransactionState,
  connectToRedux,
  withTranslation(['dashboard', 'common'])
);

const MAX_DISPLAY_ITEMS_BILLS = 2;
class UserInfomationComponent extends React.Component {
  componentWillMount() {
    this.props.getTransactionsList();
    this.props.getUserEwallets();
    this.props.getBillsList();
  }

  render() {
    const {
      currentUser,
      currentUserEWallets = [],
      logout,
      transactionsData,
      paymentsData,
      getTransactionsErrorMessages,
      getPaymentsErrorMessages,
      toggleTransactionState,
      doToggleTransaction,
      billingData = [],
      t
    } = this.props;

    const transactions = transactionsData ? transactionsData.transactions : [];
    const payments = paymentsData ? paymentsData.transactions : [];
    const bills = billingData.length !== 0 ? billingData.bills : [];

    const user = {
      ...currentUser,
      _status: <UserStatusComponent t={t} status={currentUser.status} />,
      birthDate: (
        <Moment format="MM/DD/YYYY">{new Date(currentUser.birthDate)}</Moment>
      ),
      _fullName: currentUser.title + '. ' + currentUser.fullName
    };

    const displayWallets = MAX_DISPLAY_ITEMS
      ? currentUserEWallets
          .sort((a, b) => b.balance - a.balance)
          .slice(0, MAX_DISPLAY_ITEMS)
      : currentUserEWallets;
    const displayTransactions = MAX_DISPLAY_ITEMS
      ? transactions.slice(0, MAX_DISPLAY_ITEMS)
      : transactions;
    const displayPayments = MAX_DISPLAY_ITEMS
      ? payments.slice(0, MAX_DISPLAY_ITEMS)
      : payments;
    const displayBills = MAX_DISPLAY_ITEMS_BILLS
      ? bills.slice(0, MAX_DISPLAY_ITEMS_BILLS)
      : bills;

    return (
      <div className="ks-column ks-page">
        <div className="ks-page-content">
          <div className="container-fluid ks-dashboard ks-rows-section">
            <div className="row">
              <div className="col-lg-12 pt-4">
                <div className="card card-outline-secondary mb-3 ">
                  <div className="card-header font-weight-bold">
                    {t('user_dashboard.title')}
                  </div>
                  <div className="card-block">
                    <div className="ks-wrapper">
                      <div className="row">
                        <div className="col-lg-4 p-3 ">
                          <div className="panel-default ks-user-widget shadow h-100">
                            <div className="wallet-card-header">
                              <Link href="/user/profile">
                                <a className="btn btn-outline-primary ks-light ks-no-text">
                                  <span className="icon font-icon-edit-info"></span>
                                </a>
                              </Link>
                              <Link href="/setting">
                                <a className="btn btn-outline-primary ks-light ks-no-text ml-1">
                                  <span className="icon font-icon-setting"></span>
                                </a>
                              </Link>
                            </div>
                            <UserCardDetailsComponent
                              currentUser={user}
                              logout={logout}
                            />
                          </div>
                        </div>
                        <div className="col-lg-4 p-3">
                          <div className="qr-card text-center shadow h-100">
                            <div className="card-block">
                              <h3 className="card-title">
                                {t('user_dashboard.card_qr_code.title')}
                              </h3>
                              <QrCodeComponent
                                text={createSendUrl({
                                  username: user.username
                                })}
                                showText
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 p-3 ">
                          <div className="ks-card-widget ks-widget-tasks-table shadow h-100">
                            <h5 className="card-header font-weight-bold">
                              {t('user_dashboard.card_wallets.title')}
                            </h5>

                            {!displayWallets.length ? (
                              <EmptyDataComponent
                                message={t('common:message.empty_ewallet')}
                              />
                            ) : (
                              displayWallets.map(wallet => (
                                <DisplayWalletCardComponent
                                  key={wallet.id}
                                  ewallet={wallet}
                                />
                              ))
                            )}
                            {currentUserEWallets.length > MAX_DISPLAY_ITEMS && (
                              <div className="d-flex justify-content-end p-1">
                                <Link href="/user/wallets">
                                  <span className="btn btn-info ks-light">
                                    {t(
                                      'user_dashboard.card_wallets.button.view_all'
                                    )}
                                    <span className="la la-arrow-circle-o-right ks-color-light" />
                                  </span>
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 d-flex justify-content-center">
                <div className="navbar navbar-expand-sm bg-primary navbar-dark custom-navbar">
                  <ul className="navbar-nav">
                    <li
                      className={`nav-item ${toggleTransactionState &&
                        'active'}`}
                    >
                      <a
                        className="nav-link btn"
                        onClick={() => {
                          this.props.getTransactionsList();
                          doToggleTransaction(true);
                        }}
                      >
                        {t('recent_transactions.tab_label.transactions')}
                      </a>
                    </li>
                    <li
                      className={`nav-item ${!toggleTransactionState &&
                        'active'}`}
                    >
                      <a
                        className="nav-link btn"
                        onClick={() => {
                          this.props.getPaymentsList();
                          doToggleTransaction(false);
                        }}
                      >
                        {t('recent_transactions.tab_label.payments')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-12 pt-4 pb-4">
                <div className="card card-outline-secondary pb-3">
                  <div className="card-header font-weight-bold">
                    <span className="ks-text text-center-vertical">
                      {t('recent_transactions.title.fixed_title')} {}
                      {toggleTransactionState
                        ? t(
                            'recent_transactions.title.toggle_title.transactions'
                          )
                        : t('recent_transactions.title.toggle_title.payments')}
                    </span>
                  </div>
                  <div className="container user-info-container">
                    {toggleTransactionState ? (
                      <React.Fragment>
                        {getTransactionsErrorMessages && (
                          <DisplayErrorMessagesComponent
                            messages={getTransactionsErrorMessages}
                          />
                        )}
                        <DisplayTransactionsComponent
                          transactions={displayTransactions}
                          userId={currentUser.id}
                        />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {getPaymentsErrorMessages && (
                          <DisplayErrorMessagesComponent
                            messages={getPaymentsErrorMessages}
                          />
                        )}
                        <DisplayPaymentsComponent
                          transactions={displayPayments}
                          userId={currentUser.id}
                        />
                      </React.Fragment>
                    )}
                    {toggleTransactionState
                      ? transactions.length > MAX_DISPLAY_ITEMS && (
                          <div className="d-flex justify-content-end pt-3">
                            <Link href="/user/transactions">
                              <span className="btn btn-info ks-light">
                                {t(
                                  'recent_transactions.button.view_all_transaction'
                                )}
                                <span className="la la-arrow-circle-o-right ks-color-light" />
                              </span>
                            </Link>
                          </div>
                        )
                      : payments.length > MAX_DISPLAY_ITEMS && (
                          <div className="d-flex justify-content-end pt-3">
                            <Link href="/user/payments">
                              <span className="btn btn-info ks-light">
                                {t(
                                  'recent_transactions.button.view_all_payment'
                                )}
                                <span className="la la-arrow-circle-o-right ks-color-light" />
                              </span>
                            </Link>
                          </div>
                        )}
                  </div>
                </div>
              </div>
              <div className="col-lg-12 pt-4 pb-4">
                <div className="card card-outline-secondary pb-3">
                  <div className="card-header font-weight-bold">
                    {t('recent_billings.title')}
                  </div>
                  <div className="container user-info-container">
                    <DisplayBillsComponent bills={displayBills} />
                    {billingData.length > MAX_DISPLAY_ITEMS_BILLS && (
                      <div className="d-flex justify-content-end p-4">
                        <Link href="/user/bills">
                          <span className="btn btn-info ks-light">
                            {t('recent_billings.button.view_all')}
                            <span className="la la-arrow-circle-o-right ks-color-light" />
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .shadow {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1),
              0 6px 6px rgba(0, 0, 0, 0.1);
          }
          .wallet-card-header {
            padding-left: 30px;
            padding-right: 30px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            padding: 12px 18px;
          }

          .icon {
            margin: 0;
            position: static;
            font-size: 21px;
            top: 0;
            left: 0;
            height: 37px;
            width: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .font-icon-edit-info {
            font: normal normal normal 20px/1 LineAwesome;
            text-decoration: inherit;
            text-rendering: optimizeLegibility;
            text-transform: none;
          }
          .font-icon-edit-info:before {
            content: '\f2b0';
          }
          .font-icon-setting {
            font: normal normal normal 20px/1 LineAwesome;
            text-decoration: inherit;
            text-rendering: optimizeLegibility;
            text-transform: none;
          }
          .font-icon-setting:before {
            content: "\f19a";
          }

          .font-icon-setting {
            font: normal normal normal 20px/1 LineAwesome;
            text-decoration: inherit;
            text-rendering: optimizeLegibility;
            text-transform: none;
          }

          .font-icon-setting:before {
            content: "\f19a";
          }

          .qr-card {
            min-height: 124px;
            padding: 30px 20px;
            display: flex;
            justify-content: center;
            flex-direction: row;
            border-color: #e5e5e5;
            border-radius: 3px;
            flex-wrap: wrap;
        }
          }
          .text-center-vertical{
            margin-top: auto;
            margin-bottom: auto
          }
          .custom-navbar {
            border-radius:12px;
          }
        `}</style>
      </div>
    );
  }
}
export default enhance(UserInfomationComponent);
