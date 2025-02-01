import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PaymentListComponent from '../../components/PaymentListComponent';
import UserPageLayout from '../../layouts/UserPageLayout';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const PaymentPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.payments')}>
    <PaymentListComponent />
  </UserPageLayout>
);
PaymentPage.getInitialProps = async () => ({
  namespacesRequired: []
});
export default enhance(PaymentPage);
