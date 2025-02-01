import {
  CopyTextComponent,
  DisplayErrorMessagesComponent,
  QrCodeComponent
} from '@revtech/rev-shared/components';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getbackUrl } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createDepositAddress } from '@revtech/rev-shared/apis/actions';
import {
  depositAddressSelector,
  createDepositAddressErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import { CreateDepositAddressAPIResetter } from '@revtech/rev-shared/apis/resetters';

import { trackingIdSelector } from '../stores/UserState';
import CoinListComponent from './CoinListComponent';

const getDepositAddress = (order, t) => {
  if (!order) {
    return '';
  }
  if (!order.address) {
    return t('message.under_development');
  }
  return order.address;
};

const connectToRedux = connect(
  createStructuredSelector({
    depositOrder: depositAddressSelector,
    trackingId: trackingIdSelector,
    errorMessages: createDepositAddressErrorSelector
  }),
  dispatch => ({
    createWallet: values => {
      dispatch(CreateDepositAddressAPIResetter);
      dispatch(createDepositAddress(values));
    },
    resetData: () => dispatch(CreateDepositAddressAPIResetter)
  })
);

const enhance = compose(connectToRedux, withTranslation('deposit'));

export const TransactionsInstructionsDetailsComponent = ({
  icon,
  title,
  content,
  style
}) => (
  <div className="col d-flex flex-row align-items-center">
    <span className="text-primary icon-block">
      <FontAwesomeIcon icon={icon} style={style} />
    </span>
    <div className="d-flex flex-column ml-2">
      <span className="text-secondary">{title}</span>
      <span className="font-weight-bold content">{content}</span>
    </div>
    <style jsx>
      {`
        .icon-block {
          height: auto;
          font-size: 32px;
        }
        .content {
          min-height: 20px;
        }
      `}
    </style>
  </div>
);
const DepositInstruction = ({ t }) => (
  <React.Fragment>
    <h6 className="">
      <span className="ks-text text-primary font-weight-bold">
        {t('instruction.title')}
      </span>
    </h6>
    <ul className="mr-4">
      <li className="font-italic font-weight-bold">
        <span>
          {t('instruction.text.policy.text_normal')}{' '}
          <a href="#">{t('instruction.text.policy.text_link')}</a>
        </span>
      </li>
      <li className="font-italic font-weight-bold">
        {t('instruction.text.note_deposit_address')}
      </li>
      <div className="row mt-2">
        <TransactionsInstructionsDetailsComponent
          icon={['fas', 'clock']}
          title={t('instruction.detail.time.title')}
          content={t('instruction.detail.time.content')}
        />
        <TransactionsInstructionsDetailsComponent
          icon={['fas', 'chart-bar']}
          title={t('instruction.detail.limit.title')}
          content={t('instruction.detail.limit.content')}
        />
      </div>
      <div className="row mt-2">
        <TransactionsInstructionsDetailsComponent
          icon={['fas', 'exchange-alt']}
          title={t('instruction.detail.fee.title')}
          content={t('instruction.detail.fee.content')}
          style={{ transform: 'rotate(90deg)' }}
        />
      </div>
    </ul>
  </React.Fragment>
);

class DepositComponent extends React.Component {
  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const {
      depositOrder,
      createWallet,
      trackingId,
      errorMessages,
      t
    } = this.props;
    return (
      <div className="ks-column ks-page">
        <div className="ks-page-content">
          <div className="container-fluid ks-dashboard ks-rows-section">
            <div className="col-lg-12 pt-4">
              <div className="card card-outline-secondary mb-3 pb-3">
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
                <div className="d-flex justify-content-center mt-4">
                  <div className="col-md-6">
                    <div className="card panel panel-default ks-information ks-light shadow border-radius">
                      <h3 className="text-center text-primary font-weight-bold">
                        {t('title')}
                      </h3>
                      <hr className="mr-4" />
                      <DepositInstruction t={t} />
                      <hr className="mr-4" />

                      <div className="form-group row mb-3">
                        <CoinListComponent
                          onChange={e => {
                            createWallet({
                              coinId: e.currentTarget.id,
                              trackingId: trackingId
                            });
                          }}
                          col="6"
                          extraClassName="mb-2"
                          label={t('label.currencies')}
                        />

                        <div className="col-md-6">
                          <label>{t('label.tracking_id')}</label>
                          <input
                            className="form-control"
                            value={trackingId}
                            disabled
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          <label>
                            <b>{t('label.deposit_address.label_bold')}</b>{' '}
                            {t('label.deposit_address.label_normal')}
                          </label>
                          <CopyTextComponent
                            className="form-control"
                            text={getDepositAddress(depositOrder)}
                          />
                        </div>
                        <div className="col-md-6 mt-3">
                          {depositOrder && depositOrder.address && (
                            <QrCodeComponent text={depositOrder.address} />
                          )}
                          {errorMessages && (
                            <div className="mt-2">
                              <DisplayErrorMessagesComponent
                                messages={errorMessages}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <style jsx>{`
                      .border-radius {
                        border-radius: 12px;
                      }
                    `}</style>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default enhance(DepositComponent);
