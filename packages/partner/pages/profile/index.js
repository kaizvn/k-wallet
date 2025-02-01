import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import PartnerProfileComponent from '../../components/PartnerProfileComponent';

const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));

const ProfilePage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    isLoggedIn={true}
    isAppbarTitle={false}
    title={t('page_header.profile.index')}
  >
    <PartnerProfileComponent />
  </PartnerPageLayout>
);
ProfilePage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(ProfilePage);
