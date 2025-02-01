import {
  DisplayErrorMessagesComponent,
  SearchTableComponent
} from '@revtech/rev-shared/components';
import { DEFAULT_DATE_RANGE } from '@revtech/rev-shared/utils';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getbackUrl } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';

import { getQuickFilterPaymentsList } from '@revtech/rev-shared/apis/actions';
import {
  getQuickFilterPaymentsListSelector,
  getQuickFilterPaymentsErrorSelector
} from '@revtech/rev-shared/apis/selectors';

import { currentUserSelector } from '../stores/UserState';
import DisplayPaymentsComponent from './DisplayPaymentsComponent';
import PaginationComponent from './PaginationComponent';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    paymentsData: getQuickFilterPaymentsListSelector,
    getPaymentsErrorMessages: getQuickFilterPaymentsErrorSelector
  }),
  (dispatch) => ({
    getPaymentsList: (
      page = 0,
      pageSize = 9,
      searchMessage = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterPaymentsList({
            page,
            pageSize,
            searchMessage,
            dateRange
          })
        );
    }
  })
);

const withSearchMessageState = withState(
  'searchMessage',
  'setSearchMessage',
  ''
);

const withDateRangeState = withState(
  'dateRange',
  'setDateRange',
  DEFAULT_DATE_RANGE
);

const enhance = compose(
  withSearchMessageState,
  withDateRangeState,
  connectToRedux,
  withTranslation('user')
);
class PaymentListComponent extends React.Component {
  componentWillMount() {
    this.props.getPaymentsList();
  }
  render() {
    const {
      paymentsData,
      currentUser,
      getPaymentsList,
      searchMessage,
      setSearchMessage,
      getPaymentsErrorMessages,
      dateRange,
      setDateRange,
      t
    } = this.props;
    const payments = paymentsData ? paymentsData.transactions : [];
    const totalCount = paymentsData ? paymentsData.pageInfos.totalCount : 0;
    const page = paymentsData ? paymentsData.pageInfos.filter.page : 0;

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
                          {t('payments.button.back')}
                        </span>
                      </Link>
                    </a>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-4 mt-4">
                  {getPaymentsErrorMessages && (
                    <DisplayErrorMessagesComponent
                      message={getPaymentsErrorMessages}
                    />
                  )}
                  <SearchTableComponent
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    searchMessage={searchMessage}
                    setSearchMessage={setSearchMessage}
                    placeholder={t('payments.placeholder_search')}
                    dispatchAction={getPaymentsList}
                    t={t}
                  />
                </div>

                <div className="container user-info-container">
                  <DisplayPaymentsComponent
                    transactions={payments}
                    userId={currentUser.id}
                  />
                </div>
                {payments.length ? (
                  <div className="row d-flex justify-content-center m-4">
                    <PaginationComponent
                      actions={getPaymentsList}
                      totalCount={totalCount}
                      page={page}
                    />
                  </div>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default enhance(PaymentListComponent);
