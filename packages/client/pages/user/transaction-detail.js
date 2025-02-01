import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import TransactionUserDetailComponent from '../../components/TransactionUserDetailComponent';
import UserPageLayout from '../../layouts/UserPageLayout';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const TransactionDetailPage = ({ t, ...rootProps }) => (
  <UserPageLayout
    {...rootProps}
    title={t('page_header.user.transaction_details')}
  >
    <TransactionUserDetailComponent />
  </UserPageLayout>
);
TransactionDetailPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default enhance(TransactionDetailPage);
