import {
  ButtonActionTableComponent,
  DisplayErrorMessagesComponent,
  InvoiceStatusComponent
} from '@revtech/rev-shared/components';
import {
  DATE_TIME_FORMAT,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import { ReactTableLayout } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { createLink } from '@revtech/rev-shared/libs';
import Moment from 'react-moment';
import React, { useState } from 'react';

import {
  getQuickFilterInvoicesSelector,
  getQuickFilterInvoices,
  reSendInvoiceEmail,
  reSendInvoiceMailErrorSelector
} from '../stores/InvoiceState';
import { Replay, Visibility } from '@material-ui/icons';
import Router from 'next/router';

const connectToRedux = connect(
  createStructuredSelector({
    invoicesData: getQuickFilterInvoicesSelector,
    reSendInvoiceEmailError: reSendInvoiceMailErrorSelector
  }),
  dispatch => ({
    getInvoices: (
      page = 0,
      pageSize = 10,
      searchText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterInvoices({
            page,
            pageSize,
            filterContents: searchText.trim(),
            dateRange
          })
        );
    },
    reSendInvoiceEmail: invoiceID => dispatch(reSendInvoiceEmail(invoiceID))
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation(['react-table', 'common', 'invoice'])
);

const InvoiceManagementComponent = ({
  invoicesData,
  getInvoices,
  t,
  reSendInvoiceEmailError,
  reSendInvoiceEmail
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const getInvoiceManagementActions = invoice => [
    {
      label: t('invoice:invoice.button.resend'),
      action: () => {
        reSendInvoiceEmail(invoice.id);
      },
      icon: <Replay />
    },
    {
      label: t('invoice:invoice.button.view'),
      action: () => {
        Router.push(createLink(['invoice', `details?id=${invoice.id}`]));
      },
      icon: <Visibility />
    }
  ];

  const mapinvoicesListToDataField = ({ invoices = [] }) =>
    invoices.map((invoice = {}) => {
      return {
        dateCreated: (
          <Moment format={DATE_TIME_FORMAT}>{invoice.createdAt}</Moment>
        ),
        invoice: invoice.invoiceCode,
        duedate: <Moment format={DATE_TIME_FORMAT}>{invoice.dueDate}</Moment>,
        client: (invoice.to || {}).name,
        status: <InvoiceStatusComponent t={t} status={invoice.status} />,
        amount: `${invoice.totalAmount} $`,
        action: getInvoiceManagementActions(
          invoice,
          {}
        ).map(({ label, action, icon }, index) => (
          <ButtonActionTableComponent
            key={index}
            label={label}
            action={action}
            icon={icon}
          />
        ))
      };
    });
  const COLUMNS = [
    {
      field: 'dateCreated',
      title: t('table.invoice.header.date')
    },
    {
      field: 'invoice',
      title: t('table.invoice.header.invoice')
    },
    {
      field: 'duedate',
      title: t('table.invoice.header.due_date')
    },
    {
      field: 'client',
      title: t('table.invoice.header.client')
    },
    {
      field: 'status',
      title: t('table.invoice.header.status')
    },
    {
      field: 'amount',
      title: t('table.invoice.header.amount')
    },
    {
      field: 'action',
      title: t('table.invoice.header.actions')
    }
  ];
  let invoices = [],
    totalCount = 0,
    page = 0,
    pageSize = 10;
  if (invoicesData) {
    invoices = invoicesData.invoices;
    totalCount = invoicesData.pageInfos.totalCount;
    page = invoicesData.pageInfos.filter.page;
    pageSize = invoicesData.pageInfos.filter.pageSize;
  }
  return (
    <React.Fragment>
      <DisplayErrorMessagesComponent messages={reSendInvoiceEmailError} />
      <ReactTableLayout
        searchProps={{
          placeholder: t('table.invoice.placeholder_search'),
          searchMessage,
          setSearchMessage
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={mapinvoicesListToDataField({
          invoices
        })}
        columns={COLUMNS}
        dispatchAction={getInvoices}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        t={t}
      />
    </React.Fragment>
  );
};

export default enhance(InvoiceManagementComponent);
