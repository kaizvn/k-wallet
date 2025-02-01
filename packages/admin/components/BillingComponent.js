import {
  BillStatusComponent,
  DisplayErrorMessagesComponent,
  FrameHeaderComponent
} from '@revtech/rev-shared/components';
import {
  DATE_TIME_FORMAT,
  InformationComponent,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
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

const withDateRangeState = withState(
  'dateRange',
  'setDateRange',
  DEFAULT_DATE_RANGE
);
const PAGE_SIZE_DEFAULT = 10;
const enhance = compose(
  withSearchMessageState,
  withDateRangeState,
  withTranslation(['react-table', 'common']),
  connectToRedux
);

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
    ownerName: bill.owner.fullName || bill.owner.name,
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
      t,
      errorMessages,
      dateRange,
      setDateRange
    } = this.props;
    const COLUMNS = [
      {
        accessor: 'ownerName',
        Header: t('table.transaction_billing.header.owner_name')
      },
      {
        accessor: 'address',
        Header: t('table.transaction_billing.header.address')
      },
      {
        accessor: 'status',
        Header: t('table.transaction_billing.header.status')
      },
      {
        accessor: 'currency',
        Header: t('table.transaction_billing.header.currency')
      },
      {
        accessor: 'amount',
        Header: t('table.transaction_billing.header.amount')
      },
      {
        accessor: 'actualAmount',
        Header: t('table.transaction_billing.header.actual_amount')
      },
      {
        accessor: 'paymentDate',
        Header: t('table.transaction_billing.header.payment_date')
      },
      {
        accessor: 'expiredAt',
        Header: t('table.transaction_billing.header.expired_date')
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
        <DisplayErrorMessagesComponent messages={errorMessages} />
        <FrameHeaderComponent title={t('table.transaction_billing.title')} />
        <ReactTableLayout
          searchProps={{
            placeholder: t('table.transaction_billing.placeholder_search'),
            searchMessage,
            setSearchMessage
          }}
          dateRangeProps={{
            dateRange,
            setDateRange
          }}
          data={mapBillsToDataField({ bills, t })}
          columns={COLUMNS}
          defaultPageSize={PAGE_SIZE_DEFAULT}
          dispatchAction={getListBill}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          t={t}
        />
      </React.Fragment>
    );
  }
}
export default enhance(BillingComponent);
