import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isServer, getbackUrl } from '@revtech/rev-shared/libs';
import Router from 'next/router';
import Link from 'next/link';
import {
  getTransactionByIdSelector,
  getTransactionById
} from '../stores/TransactionState';
import {
  BillDetailsCardComponent,
  TransactionDetailsCardComponent
} from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { compose } from 'recompose';
const connectToRedux = connect(
  createStructuredSelector({
    currentTransaction: getTransactionByIdSelector
  }),
  dispatch => ({
    getCurrentTransaction: id => {
      dispatch(getTransactionById(id));
    }
  })
);
const enhance = compose(
  connectToRedux,
  withTranslation('user')
);
class TransactionUserDetailComponent extends React.Component {
  componentWillMount() {
    if (!isServer) {
      const { id } = Router.router.query;
      this.props.getCurrentTransaction(id);
    }
  }
  render() {
    const { currentTransaction, t } = this.props;
    let bill = null;
    if (currentTransaction) {
      bill = currentTransaction.bill;
    }
    return (
      <div className="ks-column ks-page">
        <div className="ks-page-content">
          <div className="container-fluid ks-dashboard ks-rows-section">
            <div className="row">
              <div className="col-lg-12 pt-4 pb-4">
                <Link href={getbackUrl(Router.router.pathname, '')}>
                  <span className="btn btn-info ks-light">
                    <span className="la la-arrow-circle-o-left ks-color-light" />
                    {t('transaction_detail.button.back')}
                  </span>
                </Link>
              </div>
              <div className="col-12 pt-4 pb-4">
                <div className="pb-3">
                  <div className="container">
                    <h4 className="font-weight-normal mb-0-space">
                      {t('transaction_detail.transaction_detail.title')}
                    </h4>
                    <hr className="hr-space"></hr>
                  </div>
                  <div className="container">
                    <TransactionDetailsCardComponent
                      transaction={currentTransaction}
                    />
                  </div>
                </div>
              </div>
              <div className="col-12 pt-4 pb-4">
                <div className="pb-3">
                  <div className="container">
                    <h4 className="font-weight-normal mb-0-space">
                      {t('transaction_detail.billing_detail.title')}
                    </h4>
                    <hr className="hr-space"></hr>
                  </div>
                  <div className="container">
                    <BillDetailsCardComponent bill={bill} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .hr-space {
              margin-top: 12px;
              margin-bottom: 12px;
              opacity: 0.75;
            }
          `}
        </style>
      </div>
    );
  }
}

export default enhance(TransactionUserDetailComponent);
