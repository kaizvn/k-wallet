import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const PartnerAuthorizationPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    title={t('page_header.member.authorization')}
  >
    <div> underconstruction </div>
  </PartnerPageLayout>
);
PartnerAuthorizationPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(PartnerAuthorizationPage);
