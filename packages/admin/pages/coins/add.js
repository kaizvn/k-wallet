import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import CoinAddingComponent from '../../components/CoinAddingComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const AddCoinPage = rootProps => {
  return (
    <AdminPageLayout
      {...rootProps}
      title={rootProps.t('page_header.coin.add_new')}
    >
      <CoinAddingComponent />
    </AdminPageLayout>
  );
};
AddCoinPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(AddCoinPage));
