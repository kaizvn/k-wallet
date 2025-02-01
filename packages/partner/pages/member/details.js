import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import MemberDetailsComponent from '../../components/MemberDetailsComponent';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const DetailsPage = ({ t, ...rootProps }) => {
  return (
    <PartnerPageLayout {...rootProps} title={t('page_header.member.details')}>
      <MemberDetailsComponent />
    </PartnerPageLayout>
  );
};
DetailsPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});
export default enhance(DetailsPage);
