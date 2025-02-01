import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import EditPartnerProfileComponent from '../../components/EditPartnerProfileComponent';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';

const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));

const EditPartnerProfilePage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    isLoggedIn={true}
    title={t('page_header.profile.edit')}
  >
    <EditPartnerProfileComponent />
  </PartnerPageLayout>
);
EditPartnerProfilePage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(EditPartnerProfilePage);
