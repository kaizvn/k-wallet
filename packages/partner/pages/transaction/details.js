import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const TransactionDetailsPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout {...rootProps} title={t('page_header.transaction.detail')}>
    underconstruction
  </PartnerPageLayout>
);
TransactionDetailsPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(TransactionDetailsPage);
