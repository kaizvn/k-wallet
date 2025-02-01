import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserInfomationComponent from '../../components/UserInfomationComponent';
import UserPageLayout from '../../layouts/UserPageLayout';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const UserDashboardPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.dashboard')}>
    <UserInfomationComponent />
  </UserPageLayout>
);

UserDashboardPage.getInitialProps = async () => ({
  namespacesRequired: []
});

export default enhance(UserDashboardPage);
