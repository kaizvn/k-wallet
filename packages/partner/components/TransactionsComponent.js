import { Button, ReactTableLayout } from '@revtech/rev-shared/layouts';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE,
  parseBoolean,
  doGet
} from '@revtech/rev-shared/utils';
import {
  DisplayCoinLogoComponent,
  DisplayErrorMessagesComponent,
  FrameHeaderComponent,
  TransactionStatusComponent,
  DisplayHashUrlComponent,
  DisplayAmountTransactionComponent
} from '@revtech/rev-shared/components';
import { STATUS } from '@revtech/rev-shared/enums';
import { getLanguage } from '@revtech/rev-shared/libs';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation, i18n } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React, { useEffect, useState } from 'react';

import { getQuickFilterPaymentsList } from '@revtech/rev-shared/apis/actions';
import {
  getQuickFilterPaymentsListSelector,
  getQuickFilterPaymentsErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import { reSendCallBack } from '../stores/PaymentState';
import {
  getCurrentPartnerUser,
  currentPartnerUserSelector
} from '../stores/PartnerState';
import { Grid, Typography } from '@material-ui/core';
import { GetAppOutlined } from '@material-ui/icons';

const connectToRedux = connect(
  createStructuredSelector({
    paymentsData: getQuickFilterPaymentsListSelector,
    errorMessages: getQuickFilterPaymentsErrorSelector,
    currentPartnerUser: currentPartnerUserSelector
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
    },
    reSendCallBack: id => {
      dispatch(reSendCallBack(id));
    },
    getCurrentPartnerUser: () => dispatch(getCurrentPartnerUser())
  })
);

const { TRANSACTION_FINISHED } = STATUS;

const ReceiverWithdrawComponent = ({ transItemTo }) => (
  <span>{transItemTo.name || transItemTo.fullName || transItemTo.address}</span>
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

const mapTransactionToDataField = ({ payments = [], t, reSendCallBack }) =>
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
      ) : null,
    callbackUrl: (
      <Button
        onClick={() => {
          reSendCallBack(transItem.id);
        }}
        size="small"
      >
        {t('table.transaction.payment.re_send')}
      </Button>
    )
  }));

const enhance = compose(
  connectToRedux,
  withTranslation(['react-table', 'common'])
);

const getColumnByPartnerRole = ({ t }) => [
  {
    field: 'paymentDate',
    title: t('table.transaction.payment.header.payment_date')
  },
  {
    field: 'status',
    title: t('table.transaction.payment.header.status')
  },
  {
    field: 'currency',
    title: t('table.transaction.payment.header.currency')
  },
  {
    field: 'hashUrl',
    title: t('table.transaction.payment.header.hash')
  },
  {
    field: 'amount',
    title: t('table.transaction.payment.header.amount')
  },
  {
    field: 'receiver',
    title: t('table.transaction.payment.header.receiver')
  },
  {
    field: 'fee',
    title: t('table.transaction.payment.header.fee')
  },
  {
    field: 'exportBill',
    title: t('table.transaction.payment.header.bill'),
    width: 50
  },
  {
    field: 'callbackUrl',
    title: t('table.transaction.payment.header.resend_callback')
  }
];
const PaymentComponent = ({
  paymentsData,
  getPaymentsList,
  errorMessages,
  t,
  reSendCallBack,
  currentPartnerUser,
  getCurrentPartnerUser
}) => {
  const [isFetch, setIsFetch] = useState(true);
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);

  useEffect(() => {
    if (isFetch) {
      getCurrentPartnerUser();
      setIsFetch(false);
    }
  }, [getCurrentPartnerUser, isFetch]);

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
      <FrameHeaderComponent title={t('table.transaction.payment.title')} />
      <ReactTableLayout
        searchProps={{
          placeholder: t('table.transaction.payment.placeholder_search'),
          searchMessage,
          setSearchMessage
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={mapTransactionToDataField({
          payments,
          t,
          reSendCallBack
        })}
        columns={getColumnByPartnerRole({
          partner: currentPartnerUser,
          t
        })}
        dispatchAction={getPaymentsList}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        t={t}
      />
    </React.Fragment>
  );
};
export default enhance(PaymentComponent);
