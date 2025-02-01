import {
  DATE_TIME_FORMAT,
  InformationComponent,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import {
  FrameComponent,
  FrameHeaderComponent,
  SearchTableComponent,
  BillStatusComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { connect } from 'react-redux';
import { createLink } from '@revtech/rev-shared/libs';
import { createStructuredSelector } from 'reselect';
import { withState, compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React from 'react';

import {
  getQuickFilterBills,
  getQuickFilterBillsSelector,
  getQuickFilterBillsErrorSelector
} from '../stores/BillingState';

const connectToRedux = connect(
  createStructuredSelector({
    listBill: getQuickFilterBillsSelector,
    errorMessages: getQuickFilterBillsErrorSelector
  }),
  dispatch => ({
    getListBill: (
      page,
      pageSize,
      filterContents = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterBills({ page, pageSize, filterContents, dateRange })
        );
    }
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
  withTranslation(['react-table', 'common'])
);

const PAGE_SIZE_DEFAULT = 10;

const mapBillsToDataField = ({ bills = [], t }) =>
  bills.map(bill => ({
    paymentDate: (
      <Moment format={DATE_TIME_FORMAT}>{new Date(bill.createdAt)}</Moment>
    ),
    status: <BillStatusComponent status={bill.status} t={t} />,
    currency: bill.coin.symbol,
    amount: bill.amount,
    actualAmount: bill.actualAmount,
    expiredAt: bill.expiredAt ? (
      <Moment format={DATE_TIME_FORMAT}>{new Date(bill.expiredAt)}</Moment>
    ) : (
      t('common:not_expired_yet')
    ),
    ownerName: bill.owner.name,
    address: (
      <Link href={createLink(['transaction/billing', `details?id=${bill.id}`])}>
        <a className="ml-1">
          <InformationComponent>{bill.address} </InformationComponent>
        </a>
      </Link>
    )
  }));

class BillingComponent extends React.Component {
  render() {
    const {
      listBill,
      searchMessage,
      setSearchMessage,
      getListBill,
      errorMessages,
      t
    } = this.props;
    const COLUMNS = [
      {
        accessor: 'ownerName',
        Header: t('table.transaction.billing.header.owner_name')
      },
      {
        accessor: 'address',
        Header: t('table.transaction.billing.header.address')
      },
      {
        accessor: 'status',
        Header: t('table.transaction.billing.header.status')
      },
      {
        accessor: 'currency',
        Header: t('table.transaction.billing.header.currency')
      },
      {
        accessor: 'amount',
        Header: t('table.transaction.billing.header.amount')
      },
      {
        accessor: 'actualAmount',
        Header: t('table.transaction.billing.header.actual_amount')
      },
      {
        accessor: 'paymentDate',
        Header: t('table.transaction.billing.header.payment_date')
      },
      {
        accessor: 'expiredAt',
        Header: t('table.transaction.billing.header.expired_date')
      }
    ];
    let bills = [],
      totalCount = 0,
      page = 0,
      pageSize = 10;
    if (listBill) {
      bills = listBill.bills;
      totalCount = listBill.pageInfos.totalCount;
      page = listBill.pageInfos.filter.page;
      pageSize = listBill.pageInfos.filter.pageSize;
    }
    return (
      <React.Fragment>
        <div className="row d-flex justify-content-center">
          <SearchTableComponent
            searchMessage={searchMessage}
            setSearchMessage={setSearchMessage}
            placeholder={t('table.transaction.billing.placeholder_search')}
            dispatchAction={getListBill}
            t={t}
          />
        </div>
        {errorMessages && (
          <div className="row d-flex justify-content-center mt-4">
            <DisplayErrorMessagesComponent messages={errorMessages} />
          </div>
        )}
        <FrameComponent>
          <FrameHeaderComponent title={t('table.transaction.billing.title')} />
          <div className="ks-datatable table-responsive">
            <ReactTableLayout
              data={mapBillsToDataField({ bills, t })}
              columns={COLUMNS}
              defaultPageSize={PAGE_SIZE_DEFAULT}
              dispatchAction={getListBill}
              totalCount={totalCount}
              page={page}
              pageSize={pageSize}
              {...this.props}
            />
          </div>
        </FrameComponent>
      </React.Fragment>
    );
  }
}
export default enhance(BillingComponent);
