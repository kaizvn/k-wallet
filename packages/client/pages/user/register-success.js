import React from 'react';

import UserRegisterSuccessComponent from '../../components/UserRegisterSuccessComponent';
import UserPageLayout from '../../layouts/UserPageLayout';
import { withTranslation } from '@revtech/rev-shared/i18n';

const RegisterSuccessPage = ({ t }) => (
  <UserPageLayout title={t('page_header.user.register_success')}>
    <UserRegisterSuccessComponent />
  </UserPageLayout>
);
RegisterSuccessPage.getInitialProps = () => ({
  namespacesRequired: []
});

export default withTranslation('user-page-layout')(RegisterSuccessPage);
