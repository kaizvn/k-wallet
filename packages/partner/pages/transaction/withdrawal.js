import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import WithdrawalComponent from '../../components/WithdrawalComponent';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const PaymentPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    title={t('page_header.transaction.withdrawal')}
  >
    <WithdrawalComponent />
  </PartnerPageLayout>
);
PaymentPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(PaymentPage);
