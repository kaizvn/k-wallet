import { gql, nfetch } from '@revtech/rev-shared/libs';
import { getResetter } from '@revtech/rev-shared/apis/libs';
import { makeFetchAction } from 'redux-api-call';
import Router from 'next/router';

import { flow, get } from 'lodash/fp';

import { createErrorSelector } from './UserState';
import { respondToSuccess } from '../middlewares/api-reaction';

const GET_QUICK_FILTER_INVOICES = 'GetQuickFilterInvoicesAPI';
const GET_QUICK_FILTER_INVOICE_CLIENTS = 'GetQuickFilterInvoiceClientsAPI';
export const CREATE_NEW_INVOICE = 'CreateNewInvoiceAPI';
const GET_INVOICE_CLIENTS_BY_CURRENT_USER = 'GetInvoiceClientsByCurrentUserAPI';
const GET_COIN_DATA_NETWORK = 'GetCoinDataNetworkAPI';
const GET_INVOICE_DETAILS = 'GetInvoiceDetailsAPI';
export const CREATE_NEW_CLIENT = 'CreateNewClientAPI';
export const UPDATE_CLIENT = 'UpdateClientAPI';
export const GET_INVOICE_CLIENT_DETAILS = 'GetInvoiceClientDetailsAPI';
export const RE_SEND_INVOICE_EMAIL = 'ReSendInvoiceEmailAPI';

const ReSendInvoiceEmailAPI = makeFetchAction(
  RE_SEND_INVOICE_EMAIL,
  gql`
    mutation($invoiceID: ID!) {
      re_send_invoice_mail(invoiceID: $invoiceID) {
        id
      }
    }
  `
);

export const reSendInvoiceEmail = invoiceID =>
  respondToSuccess(ReSendInvoiceEmailAPI.actionCreator({ invoiceID }), resp => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
      return;
    }
  });

export const reSendInvoiceMailDataSelector = flow(
  ReSendInvoiceEmailAPI.dataSelector,
  get('data.re_send_invoice_mail')
);

export const reSendInvoiceMailErrorSelector = createErrorSelector(
  ReSendInvoiceEmailAPI
);

const UpdateClientAPI = makeFetchAction(
  UPDATE_CLIENT,
  gql`
    mutation($id: ID!, $name: String!, $email: String!) {
      update_invoice_client(id: $id, name: $name, email: $email) {
        id
      }
    }
  `
);

export const updateClient = ({ id, name, email }) => {
  return respondToSuccess(
    UpdateClientAPI.actionCreator({ id, name, email }),
    (resp, _, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }
      store.dispatch(getQuickFilterInvoiceClients({}));
      return;
    }
  );
};

export const updateClientDataSelector = flow(
  UpdateClientAPI.dataSelector,
  get('data.update_invoice_client')
);

export const updateClientErrorSelector = createErrorSelector(UpdateClientAPI);
export const updateClientResetter = getResetter(UpdateClientAPI);

const CreateNewClientAPI = makeFetchAction(
  CREATE_NEW_CLIENT,
  gql`
    mutation($name: String!, $email: String!) {
      create_new_invoice_client(name: $name, email: $email) {
        id
      }
    }
  `
);

export const createNewClient = ({ name, email }) => {
  return respondToSuccess(
    CreateNewClientAPI.actionCreator({ name, email }),
    (resp, _, store) => {
      if (resp.errors) {
        console.error(resp.errors);
        return;
      }
      store.dispatch(getQuickFilterInvoiceClients({}));
      return;
    }
  );
};

export const createNewClientDataSelector = flow(
  CreateNewClientAPI.dataSelector,
  get('data.create_new_invoice_client')
);

export const createNewClientErrorSelector = createErrorSelector(
  CreateNewClientAPI
);
export const createNewClientResetter = getResetter(CreateNewClientAPI);

const GetInvoiceDetailsAPI = makeFetchAction(
  GET_INVOICE_DETAILS,
  gql`
    query($id: ID!) {
      get_invoice(id: $id) {
        id
        invoiceCode
        owner {
          id
          name
          phone
          email
          address
        }
        to {
          name
          email
        }
        invoiceItems {
          id
          name
          description
          quantity
          price
          amount
        }
        invoiceCoins {
          id
          coin {
            id
            symbol
            name
          }
          depositAddress
          subTotal
          marginPercentage
          totalAmount
        }
        note
        totalAmount
        status
        dueDate
        createdAt
      }
    }
  `
);

export const getInvoiceDetails = id =>
  respondToSuccess(GetInvoiceDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
    }
  });

export const invoiceDetailsDataSelector = flow(
  GetInvoiceDetailsAPI.dataSelector,
  get('data.get_invoice')
);

const GetInvoiceClientDetailsAPI = makeFetchAction(
  GET_INVOICE_CLIENT_DETAILS,
  gql`
    query($id: ID!) {
      get_invoice_client(id: $id) {
        id
        email
        name
      }
    }
  `
);

export const getInvoiceClientDetails = id =>
  respondToSuccess(GetInvoiceClientDetailsAPI.actionCreator({ id }), resp => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
    }
  });

export const invoiceClientDetailsDataSelector = flow(
  GetInvoiceClientDetailsAPI.dataSelector,
  get('data.get_invoice_client')
);

export const invoiceClientDetailsResetter = getResetter(
  GetInvoiceClientDetailsAPI
);

const GetCoinDataNetworkAPI = makeFetchAction(
  GET_COIN_DATA_NETWORK,
  (listCoinIdNetwork = []) => {
    const queryCoin = listCoinIdNetwork.reduce(
      (prev, current) => prev + current + ',',
      ''
    );
    return nfetch({
      method: 'GET',
      endpoint: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${queryCoin}&per_page=100&page=1`
    })();
  }
);

export const getCoinDataNetwork = listCoinIdNetwork =>
  respondToSuccess(GetCoinDataNetworkAPI.actionCreator(listCoinIdNetwork));

export const CoinNetWorkDataSelector = GetCoinDataNetworkAPI.dataSelector;

const GetInvoiceClientsByCurrentUserAPI = makeFetchAction(
  GET_INVOICE_CLIENTS_BY_CURRENT_USER,
  gql`
    query {
      get_invoices_client_by_owner_id {
        id
        name
        email
      }
    }
  `
);

export const getInvoiceClientsByCurrentUser = () =>
  respondToSuccess(GetInvoiceClientsByCurrentUserAPI.actionCreator(), resp => {
    if (resp.errors) {
      console.log('Err:', resp.errors);
    }
  });

export const GetInvoiceClientsByCurrentUserDataSelector = flow(
  GetInvoiceClientsByCurrentUserAPI.dataSelector,
  get('data.get_invoices_client_by_owner_id')
);

export const getInvoiceClientsByCurrentUserResetter = getResetter(
  GetInvoiceClientsByCurrentUserAPI
);

const CreateNewInvoiceAPI = makeFetchAction(
  CREATE_NEW_INVOICE,
  gql`
    mutation(
      $invoiceCode: String!
      $note: String
      $toId: String!
      $carbonCopy: [String]
      $items: [InvoiceItemInput!]!
      $coins: [InvoiceCoinInput!]!
      $dueDate: DateTime
    ) {
      create_new_invoice(
        invoiceCode: $invoiceCode
        note: $note
        toId: $toId
        carbonCopy: $carbonCopy
        items: $items
        coins: $coins
        dueDate: $dueDate
      ) {
        id
      }
    }
  `
);

export const createNewInvoice = (objectValue = {}) => {
  return respondToSuccess(
    CreateNewInvoiceAPI.actionCreator(objectValue),
    resp => {
      if (resp.errors) {
        console.log('Err:', resp.errors);
        return;
      }

      Router.reload();
      return;
    }
  );
};

export const createNewInvoiceDataSelector = flow(
  CreateNewInvoiceAPI.dataSelector,
  get('create_new_invoice.data')
);

export const createNewInvoiceErrorSelector = createErrorSelector(
  CreateNewInvoiceAPI
);

const GetQuickFilterInvoicesAPI = makeFetchAction(
  GET_QUICK_FILTER_INVOICES,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_invoices(filter: $filter) {
        invoices {
          id
          invoiceCode
          owner {
            id
            name
          }
          to {
            name
            email
          }
          totalAmount
          status
          dueDate
          createdAt
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
            filterContents
          }
        }
      }
    }
  `
);

export const getQuickFilterInvoices = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterInvoicesAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: filterContents.trim(),
        dateRange
      }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
      }
    }
  );

export const getQuickFilterInvoicesSelector = flow(
  GetQuickFilterInvoicesAPI.dataSelector,
  get('data.get_quick_filter_invoices')
);

const GetQuickFilterInvoiceClientsAPI = makeFetchAction(
  GET_QUICK_FILTER_INVOICE_CLIENTS,
  gql`
    query($filter: FilterTable!) {
      get_quick_filter_invoices_client_by_owner_id(filter: $filter) {
        invoiceClients {
          id
          name
          owner {
            id
            name
          }
          email
          createdAt
        }
        pageInfos {
          totalCount
          filter {
            page
            pageSize
            filterContents
          }
        }
      }
    }
  `
);

export const getQuickFilterInvoiceClients = ({
  page = 0,
  pageSize = 10,
  filterContents = '',
  dateRange
}) =>
  respondToSuccess(
    GetQuickFilterInvoiceClientsAPI.actionCreator({
      filter: {
        page,
        pageSize,
        filterContents: filterContents.trim(),
        dateRange
      }
    }),
    resp => {
      if (resp.errors) {
        console.error(resp.errors);
      }
    }
  );

export const getQuickFilterInvoiceClientsSelector = flow(
  GetQuickFilterInvoiceClientsAPI.dataSelector,
  get('data.get_quick_filter_invoices_client_by_owner_id')
);

export const GetQuickFilterInvoiceClientsResetter = getResetter(
  GetQuickFilterInvoiceClientsAPI
);

export default {};
