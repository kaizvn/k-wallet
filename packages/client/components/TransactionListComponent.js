import {
  DisplayErrorMessagesComponent,
  PaginationComponent,
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

import {
  getQuickFilterTransactionsListSelector,
  getQuickFilterTransactionsErrorSelector,
  getQuickFilterTransactionsList
} from '../stores/PartnerState';
import { currentUserSelector } from '../stores/UserState';
import DisplayTransactionsComponent from './DisplayTransactionsComponent';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    transactionsData: getQuickFilterTransactionsListSelector,
    getTransactionsErrorMessages: getQuickFilterTransactionsErrorSelector
  }),
  (dispatch) => ({
    getTransactionsList: (
      page = 0,
      pageSize = 9,
      searchMessage = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterTransactionsList({
            page,
            pageSize,
            filterContents: searchMessage,
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
class TransactionListComponent extends React.Component {
  componentWillMount() {
    this.props.getTransactionsList();
  }
  render() {
    const {
      transactionsData,
      currentUser,
      getTransactionsList,
      searchMessage,
      setSearchMessage,
      getTransactionsErrorMessages,
      dateRange,
      setDateRange,
      t
    } = this.props;
    const transactions = transactionsData ? transactionsData.transactions : [];
    const totalCount = transactionsData
      ? transactionsData.pageInfos.totalCount
      : 0;
    const page = transactionsData ? transactionsData.pageInfos.filter.page : 0;
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
                          {t('transactions.button.back')}
                        </span>
                      </Link>
                    </a>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-4 mt-4">
                  <SearchTableComponent
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    searchMessage={searchMessage}
                    setSearchMessage={setSearchMessage}
                    placeholder={t('transactions.placeholder_search')}
                    dispatchAction={getTransactionsList}
                    t={t}
                  />
                </div>

                <div className="container user-info-container">
                  {getTransactionsErrorMessages && (
                    <DisplayErrorMessagesComponent
                      messages={getTransactionsErrorMessages}
                    />
                  )}
                  <DisplayTransactionsComponent
                    transactions={transactions}
                    userId={currentUser.id}
                  />
                </div>
                {transactions.length ? (
                  <div className="row d-flex justify-content-center m-4">
                    <PaginationComponent
                      actions={getTransactionsList}
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

export default enhance(TransactionListComponent);
