import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { getQuickFilterPendingTransactions } from '../../stores/PartnerState';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import PendingTransactionsComponent from '../../components/PendingTransactionsComponent';
import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));

const PendingTransactionsPage = rootProps => (
  <PartnerPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.pedding')}
    fetchData={() => getQuickFilterPendingTransactions(DEFAULT_PAGING_INFO)}
  >
    <PendingTransactionsComponent t={rootProps.t} />
  </PartnerPageLayout>
);
PendingTransactionsPage.getInitialProps = async () => ({
  namespacesRequired: ['react-table']
});
export default enhance(PendingTransactionsPage);
