import React from 'react';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserPageLayout from '../../layouts/UserPageLayout';
import EditUserProfileComponent from '../../components/EditUserProfileComponent';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const UserProfilePage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.profile')}>
    <EditUserProfileComponent t={t} />
  </UserPageLayout>
);

UserProfilePage.getInitialProps = () => ({
  namespacesRequired: ['user', 'common']
});

export default enhance(UserProfilePage);
