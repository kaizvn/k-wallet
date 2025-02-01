import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import PartnerPageLayout from '../../../layouts/PartnerPageLayout';
import AuthenHOC from '../../../components/HOC/AuthenHOC';
import BillingDetailsComponent from '../../../components/BillingDetailsComponent';
const enhance = compose(
  AuthenHOC,
  withTranslation('partner-page-layout')
);
const BillDetailsPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    title={t('page_header.transaction.billing.detail.title')}
  >
    <BillingDetailsComponent />
  </PartnerPageLayout>
);
BillDetailsPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(BillDetailsPage);
