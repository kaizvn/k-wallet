import React from 'react';

import { getQuickFilterCoinList } from '../../stores/CoinState';
import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import CoinManagementComponent from '../../components/CoinManagementComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const ManagePage = rootProps => (
  <AdminPageLayout
    {...rootProps}
    title={rootProps.t('page_header.coin.manage')}
    fetchData={getQuickFilterCoinList}
  >
    <CoinManagementComponent />
  </AdminPageLayout>
);
ManagePage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(ManagePage));
