import React from 'react';
import { compose } from 'recompose';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import UserPageLayout from '../../layouts/UserPageLayout';
import WithdrawalComponent from '../../components/WithdrawalComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';
const enhance = compose(AuthenHOC, withTranslation('user-page-layout'));
const WithdrawalPage = ({ t, ...rootProps }) => (
  <UserPageLayout {...rootProps} title={t('page_header.user.withdraw')}>
    <WithdrawalComponent />
  </UserPageLayout>
);

WithdrawalPage.getInitialProps = () => ({
  namespacesRequired: []
});
export default enhance(WithdrawalPage);
