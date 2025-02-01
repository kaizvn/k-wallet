import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import InvoiceDetailsComponent from '../../components/InvoiceDetailsComponent';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const DetailsPage = ({ t, ...rootProps }) => {
  return (
    <PartnerPageLayout {...rootProps} title={t('page_header.invoice.details')}>
      <InvoiceDetailsComponent />
    </PartnerPageLayout>
  );
};
DetailsPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(DetailsPage);
