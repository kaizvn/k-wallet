import React from 'react';

import { getQuickFilterPendingTransactions } from '../../stores/PartnerState';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PendingTransactionsComponent from '../../components/PendingTransactionsComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';

const PaymentPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.pending')}
    fetchData={() => getQuickFilterPendingTransactions(DEFAULT_PAGING_INFO)}
  >
    <PendingTransactionsComponent t={rootProps.t} />
  </AdminPageLayout>
);
PaymentPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(PaymentPage));
