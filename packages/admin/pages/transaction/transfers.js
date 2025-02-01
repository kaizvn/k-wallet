import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';
import { getQuickFilterTransactionsList } from '@revtech/rev-shared/apis/actions';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import TransfersComponent from '../../components/TransfersComponent';

const TransfersPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.transfers')}
    fetchData={() => getQuickFilterTransactionsList(DEFAULT_PAGING_INFO)}
  >
    <TransfersComponent />
  </AdminPageLayout>
);
TransfersPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(TransfersPage));
