import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import DepositComponent from '../../components/DepositComponent';
import UserPageLayout from '../../layouts/UserPageLayout';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const DepositPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.deposit')}>
    <link
      rel="stylesheet"
      type="text/css"
      href="/static/kosmo/assets/styles/pricing/subscriptions.min.css"
    />
    <DepositComponent />
  </UserPageLayout>
);

DepositPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default enhance(DepositPage);
