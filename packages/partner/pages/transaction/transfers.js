import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { getQuickFilterTransactionsList } from '../../stores/PartnerState';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import TransactionsComponent from '../../components/TransactionsComponent';
import { DEFAULT_PAGING_INFO } from '@revtech/rev-shared/utils';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const TransfersPage = rootProps => (
  <PartnerPageLayout
    {...rootProps}
    title={rootProps.t('page_header.transaction.transactions')}
    fetchData={() => getQuickFilterTransactionsList(DEFAULT_PAGING_INFO)}
  >
    <TransactionsComponent t={rootProps.t} />
  </PartnerPageLayout>
);
TransfersPage.getInitialProps = async () => ({
  namespacesRequired: ['react-table', 'common']
});
export default enhance(TransfersPage);
