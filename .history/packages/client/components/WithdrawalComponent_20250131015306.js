import { Button, InputText } from '@revtech/rev-shared/layouts';
import {
  SuccessComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getbackUrl, isServer } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { getWithdrawTxInfo } from '@revtech/rev-shared/apis/actions';
import {
  getWithdrawEstFeeSelector,
  getWithdrawEstFeeErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import { getWithdrawTxInfoResetter } from '@revtech/rev-shared/apis/resetters';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';

import { flow, get } from 'lodash/fp';

import { TransactionsInstructionsDetailsComponent } from './DepositComponent';
import { currentUserSelector } from '../stores/UserState';
import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import {
  withdrawDataSelector,
  withdrawErrorSelector,
  createWithdrawTransaction
} from '../stores/OrdersState';
import CoinListComponent from './CoinListComponent';

/* TODO:
 - errorselector
 - cancel button
*/

const connectToRedux = connect(
  createStructuredSelector({
    trackingId: flow(currentUserSelector, get('username')),
    availableWithdrawal: get('availableWithdrawal'),
    ewallets: myWalletsSelector,
    errorMessagesForCreateWithdraw: withdrawErrorSelector,
    errorMessagesForGetWithdraw: getWithdrawEstFeeErrorSelector,
    estFee: getWithdrawEstFeeSelector,
    successMessage: withdrawDataSelector
  }),
  (dispatch) => ({
    onSubmitWithdraw: (recipientAddress, amount, coinId) => {
      dispatch([
        getWithdrawTxInfoResetter,
        getWithdrawTxInfo({
          recipientAddress,
          amount,
          coinId
        })
      ]);
    },
    resetWithdrawTxInfo: () => dispatch(getWithdrawTxInfoResetter),
    doWithdraw: (recipientAddress, amount, trackingId, coinId) =>
      dispatch(
        createWithdrawTransaction({
          recipientAddress,
          amount,
          trackingId,
          coinId
        })
      ),
    getMyEWallets: () => {
      dispatch(getMyWallets());
    }
  })
);

const withRecipientAddressState = withState(
  'recipientAddress',
  'setRecipientAddress',
  ''
);
const withWithdrawAmountState = withState(
  'withdrawAmount',
  'setWithdrawAmount',
  ''
);
const withCoinIdState = withState('coinId', 'setCoinId', '');
const withAvailableAmountState = withState(
  'availableAmount',
  'setAvailableAmount',
  ''
);
const enhance = compose(
  withRecipientAddressState,
  withWithdrawAmountState,
  withCoinIdState,
  withAvailableAmountState,
  connectToRedux,
  withTranslation('withdrawal')
);

const WithDrawalInstruction = ({ t, estFee }) => (
  <React.Fragment>
    <h6 className="mt-2">
      <span className="ks-text text-primary font-weight-bold">
        {t('instruction.title')}
      </span>
    </h6>
    <ul className="">
      <div className="row mt-2">
        <TransactionsInstructionsDetailsComponent
          icon={['fas', 'clock']}
          title={t('instruction.detail.time.title')}
          content={t('instruction.detail.time.content')}
        />
        <TransactionsInstructionsDetailsComponent
          icon={['fas', 'exchange-alt']}
          title={t('instruction.detail.fee.title')}
          content={
            estFee && <span className="flashit text-danger">{estFee}</span>
          }
          style={{ transform: 'rotate(90deg)' }}
        />
      </div>
      <div className="row mt-2">
        <TransactionsInstructionsDetailsComponent
          icon={['fas', 'chart-bar']}
          title={t('instruction.detail.limit.title')}
          content={
            <React.Fragment>
              <span className="font-weight-bold">
                10{' '}
                <font color="red">
                  {t('instruction.detail.limit.content.unit_character')}
                </font>
                {' / '}
                {t('instruction.detail.limit.content.day')}
              </span>
              <br />
              <span className="text-danger">
                {t('instruction.detail.limit.content.unit_character')}
                {' : '}
                {t('instruction.detail.limit.content.unit_text')}
              </span>
            </React.Fragment>
          }
        />
      </div>
    </ul>
    <style jsx>{`
      .flashit {
        -webkit-animation: flash linear 1.5s;
        animation: flash linear 1.5s;
      }
      @-webkit-keyframes flash {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.1;
        }
        100% {
          opacity: 1;
        }
      }
      @keyframes flash {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0.1;
        }
        100% {
          opacity: 1;
        }
      }
    `}</style>
  </React.Fragment>
);

class WithdrawalComponent extends React.Component {
  componentWillMount() {
    if (!isServer) {
      this.props.getMyEWallets();
      this.props.resetWithdrawTxInfo();
    }
  }

  render() {
    const {
      estFee,
      setWithdrawAmount,
      setRecipientAddress,
      recipientAddress,
      withdrawAmount,
      trackingId,
      doWithdraw,
      ewallets,
      coinId,
      setCoinId,
      availableAmount,
      setAvailableAmount,
      errorMessagesForCreateWithdraw,
      errorMessagesForGetWithdraw,
      successMessage,
      onSubmitWithdraw,
      resetWithdrawTxInfo,
      t
    } = this.props;

    const errorMessages = [
      ...errorMessagesForCreateWithdraw,
      ...errorMessagesForGetWithdraw
    ];
    return (
      <div>
        <div className="card-header font-weight-bold">
          <div className="ks-controls">
            <a className="ks-control ks-update">
              <Link href={getbackUrl(Router.router.pathname, '')}>
                <span className="btn btn-info ks-light">
                  <span className="la la-arrow-circle-o-left ks-color-light" />
                  {t('button.back')}
                </span>
              </Link>
            </a>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4 mb-4">
          <div className="col-md-8">
            <div className="card panel panel-default ks-information ks-light shadow border-radius p-4">
              <h3 className="text-center text-primary">{t('title')}</h3>
              <hr className="" />
              <WithDrawalInstruction t={t} estFee={estFee} />
              <hr className="" />
              <h5 className="mt-2">
                <span className="ks-text font-italic font-weight-bold text-primary">
                  {t('mount.title')}
                </span>
              </h5>
              <div className="row">
                <CoinListComponent
                  wallets={ewallets}
                  onChange={(e) => {
                    const walletByCoin =
                      ewallets &&
                      ewallets.find(
                        (item) => item.coin.id === e.currentTarget.id
                      );
                    setCoinId(walletByCoin && walletByCoin.coin.id);
                    setAvailableAmount(walletByCoin && walletByCoin.balance);
                  }}
                  col="6"
                  extraClassName="mb-2"
                  label={
                    <span>
                      {t('amount.label.available')}:{' '}
                      <strong>{availableAmount || 0}</strong>
                    </span>
                  }
                />
                <div className="col-md-6">
                  <label className="ks-text font-weight-bold">
                    {t('amount.label.remittance_amount')}:
                  </label>
                  <InputText
                    className="form-control "
                    onChange={(e) => setWithdrawAmount(e)}
                    disabled={estFee}
                  />
                </div>
              </div>
              <h5 className="mt-4">
                <span className="ks-text font-italic font-weight-bold text-primary">
                  {t('recipient.title')}
                </span>
              </h5>
              <span className="ks-text mb-2 font-italic">
                {t('recipient.content')}
              </span>
              <div className="row">
                <div className="col-md-12 ">
                  <InputText
                    className="form-control"
                    onChange={(e) => {
                      setRecipientAddress(e);
                    }}
                    disabled={estFee}
                  />
                </div>
              </div>
              {errorMessages && (
                <DisplayErrorMessagesComponent messages={errorMessages} />
              )}
              {successMessage && (
                <SuccessComponent title={t('message.payment_completed')} />
              )}
              <div className="d-flex mt-2 justify-content-end">
                <div className="m-1">
                  {!estFee ? (
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        onSubmitWithdraw(
                          recipientAddress,
                          parseFloat(withdrawAmount),
                          coinId
                        );
                      }}
                    >
                      {t('button.withdraw')}
                    </Button>
                  ) : (
                    <div className="withdrawal-group-btn">
                      <div className="cancel-btn">
                        <Button danger onClick={() => resetWithdrawTxInfo()}>
                          {t('button.cancel')}
                        </Button>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          doWithdraw(
                            recipientAddress,
                            parseFloat(withdrawAmount),
                            trackingId,
                            coinId
                          );
                        }}
                      >
                        {t('button.confirm')}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <style jsx>{`
              .border-radius {
                border-radius: 12px;
              }
              .withdrawal-group-btn {
                display: flex;
              }
              .cancel-btn {
                margin-right: 5px;
              }
            `}</style>
          </div>
        </div>
      </div>
    );
  }
}
export default enhance(WithdrawalComponent);
