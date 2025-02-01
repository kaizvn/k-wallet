import { getAllPayments } from '@revtech/rev-shared/apis/actions';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import TransactionsReviewComponent from '../../components/TransactionsReviewComponent';

const PaymentPage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction_payment.title')}
    fetchData={getAllPayments}
  >
    <TransactionsReviewComponent t={rootProps.t} />
  </AdminPageLayout>
);
PaymentPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(PaymentPage));
