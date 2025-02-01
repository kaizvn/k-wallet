import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  parseBoolean,
  doGet
} from '@revtech/rev-shared/utils';
import { getLanguage } from '@revtech/rev-shared/libs';
import {
  DisplayCoinLogoComponent,
  DisplayErrorMessagesComponent,
  FrameHeaderComponent,
  TransactionStatusComponent,
  DisplayHashUrlComponent,
  DisplayAmountTransactionComponent
} from '@revtech/rev-shared/components';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { STATUS } from '@revtech/rev-shared/enums';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation, i18n } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React, { useState } from 'react';

import { getQuickFilterPaymentsList } from '@revtech/rev-shared/apis/actions';
import {
  getQuickFilterPaymentsListSelector,
  getQuickFilterPaymentsErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import { Grid, Typography } from '@material-ui/core';
import { GetAppOutlined } from '@material-ui/icons';

const { TRANSACTION_FINISHED } = STATUS;

const ReceiverWithdrawComponent = ({ transItemTo }) => (
  <span>{transItemTo.name || transItemTo.fullName || transItemTo.address}</span>
);

const connectToRedux = connect(
  createStructuredSelector({
    paymentsData: getQuickFilterPaymentsListSelector,
    errorMessages: getQuickFilterPaymentsErrorSelector
  }),
  dispatch => ({
    getPaymentsList: (
      page,
      pageSize,
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

const createAndDownloadBill = idTrans => {
  const currentLanguage = parseBoolean(getLanguage())
    ? getLanguage()
    : i18n.options.defaultLanguage;

  doGet({
    url: `${process.env.API_SERVER_URL}/generate-bill/${currentLanguage}/${idTrans}`,
    responseType: 'blob'
  }).then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RevPayment.pdf`);
    document.body.appendChild(link);
    link.click();
  });
};

const mapTransactionToDataField = ({ payments = [], t }) =>
  payments.map(transItem => ({
    paymentDate: (
      <Moment format={DATE_TIME_FORMAT}>{new Date(transItem.createdAt)}</Moment>
    ),
    status: <TransactionStatusComponent status={transItem.status} t={t} />,
    currency: (
      <Grid container alignItems="center" direction="row">
        <DisplayCoinLogoComponent coin={transItem.coin} small />
        <span>&nbsp;&nbsp;</span>
        <Typography style={{ fontWeight: 'bold' }} variant="button">
          {transItem.coin.symbol}
        </Typography>
      </Grid>
    ),
    hashUrl: transItem.hash && (
      <DisplayHashUrlComponent
        hash={transItem.hash}
        hashUrl={transItem.hashUrl}
      />
    ),
    amount: (
      <DisplayAmountTransactionComponent
        type={transItem.type}
        amount={transItem.amount}
      />
    ),
    receiver: transItem.receivedAddress || (
      <ReceiverWithdrawComponent transItemTo={transItem.to} />
    ),
    fee: (
      <Typography color="error" variant="body2">
        {transItem.fee}
      </Typography>
    ),
    exportBill:
      transItem.status === TRANSACTION_FINISHED ? (
        <GetAppOutlined
          style={{
            cursor: 'pointer'
          }}
          onClick={() => createAndDownloadBill(transItem.id)}
        />
      ) : null
  }));

const enhance = compose(
  withTranslation(['react-table', 'common']),
  connectToRedux
);

const PaymentsComponent = ({
  paymentsData,
  getPaymentsList,
  errorMessages,
  t
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);

  const COLUMNS = [
    {
      field: 'paymentDate',
      title: t('table.payments_manage.header.payment_date')
    },
    {
      field: 'status',
      title: t('table.payments_manage.header.status')
    },
    {
      field: 'currency',
      title: t('table.payments_manage.header.currency')
    },
    {
      field: 'hashUrl',
      title: t('table.payments_manage.header.hash')
    },
    {
      field: 'amount',
      title: t('table.payments_manage.header.amount')
    },
    {
      field: 'receiver',
      title: t('table.payments_manage.header.receiver')
    },
    {
      field: 'fee',
      title: t('table.payments_manage.header.fee')
    },
    {
      field: 'exportBill',
      title: t('table.payments_manage.header.bill'),
      width: 50
    }
  ];
  let payments = [],
    totalCount = 0,
    page = 0,
    pageSize = 10;
  if (paymentsData) {
    payments = paymentsData.transactions;
    totalCount = paymentsData.pageInfos.totalCount;
    page = paymentsData.pageInfos.filter.page;
    pageSize = paymentsData.pageInfos.filter.pageSize;
  }
  return (
    <React.Fragment>
      <DisplayErrorMessagesComponent messages={errorMessages} />
      <FrameHeaderComponent title={t('table.payments_manage.title')} />
      <ReactTableLayout
        searchProps={{
          placeholder: t('table.payments_manage.placeholder_search'),
          searchMessage,
          setSearchMessage
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={mapTransactionToDataField({ payments, t })}
        columns={COLUMNS}
        dispatchAction={getPaymentsList}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        t={t}
      />
    </React.Fragment>
  );
};
export default enhance(PaymentsComponent);
