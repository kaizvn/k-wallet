import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserPageLayout from '../../layouts/UserPageLayout';
import BillListComponent from '../../components/BillListComponent';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);

const WalletsPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.bills')}>
    <BillListComponent />
  </UserPageLayout>
);

WalletsPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default enhance(WalletsPage);
