import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import TransactionListComponent from '../../components/TransactionListComponent';
import UserPageLayout from '../../layouts/UserPageLayout';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const TransactionPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.transactions')}>
    <TransactionListComponent />
  </UserPageLayout>
);
TransactionPage.getInitialProps = async () => ({
  namespacesRequired: []
});
export default enhance(TransactionPage);
