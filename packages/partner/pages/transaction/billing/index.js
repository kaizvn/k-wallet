import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { getQuickFilterBills } from '../../../stores/BillingState';
import AuthenHOC from '../../../components/HOC/AuthenHOC';
import BillingComponent from '../../../components/BillingComponent';
import PartnerPageLayout from '../../../layouts/PartnerPageLayout';
import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';
const enhance = compose(
  AuthenHOC,
  withTranslation('partner-page-layout')
);
const PartnerBillingPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    title={t('page_header.transaction.billing.title')}
    fetchData={() => getQuickFilterBills(DEFAULT_PAGING_INFO)}
  >
    <BillingComponent />
  </PartnerPageLayout>
);
PartnerBillingPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(PartnerBillingPage);
