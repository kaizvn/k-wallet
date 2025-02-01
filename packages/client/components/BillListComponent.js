import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getbackUrl } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import React from 'react';
import Router from 'next/router';
import {
  getQuickFilterBillsSelector,
  getQuickFilterBills,
  getQuickFilterBillsErrorSelector
} from '../stores/BillingState';
import {
  SearchTableComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { currentUserSelector } from '../stores/UserState';
import DisplayBillsComponent from './DisplayBillsComponent';
import PaginationComponent from './PaginationComponent';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    billsData: getQuickFilterBillsSelector,
    errorMessages: getQuickFilterBillsErrorSelector
  }),
  (dispatch) => ({
    getBillsList: (page = 0, pageSize = 9, searchMessage = '') =>
      dispatch(
        getQuickFilterBills({
          page,
          pageSize,
          filterContents: searchMessage.trim()
        })
      )
  })
);

const withSearchMessageState = withState(
  'searchMessage',
  'setSearchMessage',
  ''
);

const enhance = compose(
  withSearchMessageState,
  connectToRedux,
  withTranslation('user')
);
class BillListComponent extends React.Component {
  componentWillMount() {
    this.props.getBillsList();
  }
  render() {
    const {
      billsData,
      getBillsList,
      searchMessage,
      setSearchMessage,
      errorMessages,
      t
    } = this.props;
    const bills = billsData ? billsData.bills : [];
    const totalCount = billsData ? billsData.pageInfos.totalCount : 0;
    const page = billsData ? billsData.pageInfos.filter.page : 0;

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
                          {t('bills.button.back')}
                        </span>
                      </Link>
                    </a>
                  </div>
                </div>
                <div className="row d-flex justify-content-center mb-4 mt-4">
                  <SearchTableComponent
                    searchMessage={searchMessage}
                    setSearchMessage={setSearchMessage}
                    placeholder={t('bills.placeholder_search')}
                    dispatchAction={getBillsList}
                  />
                </div>
                {errorMessages && (
                  <div className="row d-flex justify-content-center mt-4">
                    <DisplayErrorMessagesComponent messages={errorMessages} />
                  </div>
                )}
                <div className="container user-info-container">
                  <DisplayBillsComponent bills={bills} />
                </div>
                {bills.length ? (
                  <div className="row d-flex justify-content-center m-4">
                    <PaginationComponent
                      actions={getBillsList}
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

export default enhance(BillListComponent);
