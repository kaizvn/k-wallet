import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';
import { getQuickFilterPaymentsList } from '@revtech/rev-shared/apis/actions';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import TransactionsComponent from '../../components/TransactionsComponent';

const TransactionsPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.transactions')}
    fetchData={() => getQuickFilterPaymentsList(DEFAULT_PAGING_INFO)}
  >
    <TransactionsComponent />
  </AdminPageLayout>
);
TransactionsPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(
  AuthenHOC(TransactionsPage)
);
