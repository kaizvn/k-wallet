import React from 'react';

import { getQuickFilterBills } from '../../../stores/BillingState';
import AdminPageLayout from '../../../layouts/AdminPageLayout';
import AuthenHOC from '../../../components/HOC/AuthenHOC';
import BillingComponent from '../../../components/BillingComponent';
import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';
import { withTranslation } from '@revtech/rev-shared/i18n';

const BillsPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.billing')}
    fetchData={() => getQuickFilterBills(DEFAULT_PAGING_INFO)}
  >
    <BillingComponent />
  </AdminPageLayout>
);

BillsPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(BillsPage));
