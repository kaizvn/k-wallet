import React from 'react';

import AdminPageLayout from '../../../layouts/AdminPageLayout';
import AuthenHOC from '../../../components/HOC/AuthenHOC';
import BillingDetailsComponent from '../../../components/BillingDetailsComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const BillDetailsPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.billing_details')}
  >
    <BillingDetailsComponent />
  </AdminPageLayout>
);

export default withTranslation('admin-page-layout')(AuthenHOC(BillDetailsPage));
