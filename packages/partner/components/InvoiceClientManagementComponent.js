import { ButtonActionTableComponent } from '@revtech/rev-shared/components';
import { DEFAULT_DATE_RANGE } from '@revtech/rev-shared/utils';
import {
  ReactTableLayout,
  AlertDialog,
  Button
} from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React, { useEffect, useState } from 'react';

import {
  getQuickFilterInvoiceClientsSelector,
  getQuickFilterInvoiceClients,
  createNewClientDataSelector,
  updateClientDataSelector,
  GetQuickFilterInvoiceClientsResetter
} from '../stores/InvoiceState';
import { Edit, Receipt } from '@material-ui/icons';
import Router from 'next/router';
import InvoiceClientActionsComponent from './InvoiceClientActionsComponent';
import { Box } from '@material-ui/core';

const connectToRedux = connect(
  createStructuredSelector({
    invoiceClientsData: getQuickFilterInvoiceClientsSelector,
    createClientData: createNewClientDataSelector,
    updateClientData: updateClientDataSelector
  }),
  dispatch => ({
    getInvoiceClients: (
      page = 0,
      pageSize = 10,
      searchText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterInvoiceClients({
            page,
            pageSize,
            filterContents: searchText.trim(),
            dateRange
          })
        );
    },
    resetData: () => {
      dispatch(GetQuickFilterInvoiceClientsResetter);
    }
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation(['react-table', 'common', 'invoice'])
);

const InvoiceClientManagementComponent = ({
  invoiceClientsData,
  getInvoiceClients,
  t,
  setCurrentTab,
  createClientData,
  resetData,
  updateClientData
}) => {
  const [isOpenClient, setIsOpenClient] = useState(false);
  const [isOpenUpdateClient, setIsOpenUpdateClient] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [currentClientIdSelected, setCurrentClientIdSelected] = useState(null);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);

  useEffect(() => {
    if (createClientData) {
      setIsOpenClient(false);
    }
    return () => {
      resetData();
    };
  }, [createClientData, resetData]);

  useEffect(() => {
    if (updateClientData) {
      setIsOpenUpdateClient(false);
    }
  }, [updateClientData]);

  const getInvoiceManagementActions = (
    invoiceClient,
    { setCurrentTab, setCurrentClientIdSelected, setIsOpenUpdateClient }
  ) => [
    {
      label: t('invoice:invoice_client.button.create_invoice'),
      action: () => {
        Router.push(
          {
            pathname: '/invoice',
            query: { clientId: invoiceClient.id }
          },
          undefined,
          { shallow: true }
        );
        setCurrentTab(1);
      },
      icon: <Receipt fontSize="small" />
    },
    {
      label: t('invoice:invoice_client.button.edit'),
      action: () => {
        setCurrentClientIdSelected(invoiceClient.id);
        setIsOpenUpdateClient(true);
      },
      icon: <Edit fontSize="small" />
    }
  ];

  const mapinvoicesListToDataField = ({
    invoiceClients = [],
    setCurrentTab,
    setCurrentClientIdSelected,
    setIsOpenUpdateClient
  }) =>
    invoiceClients.map((invoiceClient = {}) => {
      return {
        name: invoiceClient.name,
        email: invoiceClient.email,
        action: getInvoiceManagementActions(invoiceClient, {
          setCurrentTab,
          setCurrentClientIdSelected,
          setIsOpenUpdateClient
        }).map(({ label, action, icon }, index) => (
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
      field: 'name',
      title: t('table.invoice_client.header.name')
    },
    {
      field: 'email',
      title: t('table.invoice_client.header.email')
    },
    {
      field: 'action',
      title: t('table.invoice_client.header.actions')
    }
  ];
  let invoiceClients = [],
    totalCount = 0,
    page = 0,
    pageSize = 10;
  if (invoiceClientsData) {
    invoiceClients = invoiceClientsData.invoiceClients;
    totalCount = invoiceClientsData.pageInfos.totalCount;
    page = invoiceClientsData.pageInfos.filter.page;
    pageSize = invoiceClientsData.pageInfos.filter.pageSize;
  }
  return (
    <React.Fragment>
      <AlertDialog
        title={t('invoice:invoice_client.title.create_new_client')}
        onClose={() => setIsOpenClient(false)}
        fullWidth
        size="sm"
        isOpenDialog={isOpenClient}
        setIsOpenDialog={setIsOpenClient}
        isFooter={false}
        content={
          isOpenClient && (
            <InvoiceClientActionsComponent
              onCancel={() => setIsOpenClient(false)}
            />
          )
        }
      />
      <AlertDialog
        title={t('invoice:invoice_client.title.update_client')}
        onClose={() => setIsOpenUpdateClient(false)}
        fullWidth
        size="sm"
        isOpenDialog={isOpenUpdateClient}
        setIsOpenDialog={setIsOpenUpdateClient}
        isFooter={false}
        content={
          isOpenUpdateClient && (
            <InvoiceClientActionsComponent
              invoiceClientId={currentClientIdSelected}
              isUpdate={true}
              onCancel={() => setIsOpenUpdateClient(false)}
            />
          )
        }
      />
      <ReactTableLayout
        searchProps={{
          placeholder: t('table.invoice_client.placeholder_search'),
          searchMessage,
          setSearchMessage
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={mapinvoicesListToDataField({
          invoiceClients,
          setCurrentTab,
          setCurrentClientIdSelected,
          setIsOpenUpdateClient
        })}
        columns={COLUMNS}
        dispatchAction={getInvoiceClients}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        t={t}
      />
      <Box mt={2}>
        <Button onClick={() => setIsOpenClient(true)} size="large">
          {t('invoice:invoice_client.title.create_new_client')}
        </Button>
      </Box>
    </React.Fragment>
  );
};

export default enhance(InvoiceClientManagementComponent);
