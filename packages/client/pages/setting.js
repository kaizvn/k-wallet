import React from 'react';

import AuthenHOC from '../components/HOC/AuthenHOC';
import UserPageLayout from '../layouts/UserPageLayout';
import AccountSettingComponent from '../components/AccountSettingComponent';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const UserSettingPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.settings')}>
    <AccountSettingComponent />
  </UserPageLayout>
);

UserSettingPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default enhance(UserSettingPage);
