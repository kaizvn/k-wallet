import React from 'react';

import AdminPageLayout from '../../layouts/AdminPageLayout';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import CoinEditComponent from '../../components/CoinEditComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const EditCoinPage = rootProps => {
  return (
    <AdminPageLayout
      {...rootProps}
      title={rootProps.t('page_header.coin.edit')}
    >
      <CoinEditComponent />
    </AdminPageLayout>
  );
};
EditCoinPage.getInitialProps = async () => ({
  namespacesRequired: ['admin-page-layout']
});

export default withTranslation('admin-page-layout')(AuthenHOC(EditCoinPage));
