import React from 'react';

import UserPageLayout from '../../layouts/UserPageLayout';
import UserResetPasswordComponent from '../../components/UserResetPasswordComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const UserResetPasswordPage = ({ initialValues, t }) => {
  return (
    <UserPageLayout title={t('page_header.user.reset_password')}>
      <UserResetPasswordComponent initialValues={initialValues} />
    </UserPageLayout>
  );
};

UserResetPasswordPage.getInitialProps = (ctx) => {
  const {
    query: { token }
  } = ctx;
  return {
    initialValues: { token },
    namespacesRequired: ['common']
  };
};

export default withTranslation('user-page-layout')(UserResetPasswordPage);
