import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserPageLayout from '../../layouts/UserPageLayout';
import TwoFactorAuthenComponent from '../../components/TwoFactorAuthenComponent';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const TwoFactorAuthenPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.two_factor')}>
    <TwoFactorAuthenComponent />
  </UserPageLayout>
);

TwoFactorAuthenPage.getInitialProps = () => ({
  namespacesRequired: ['user']
});

export default enhance(TwoFactorAuthenPage);
