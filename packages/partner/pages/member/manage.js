import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

import { getQuickFilterMemberList } from '../../stores/PartnerState';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerMemberManagementComponent from '../../components/PartnerMemberManagementComponent';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';

const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));

const MemberPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout
    {...rootProps}
    title={t('page_header.member.manage')}
    fetchData={getQuickFilterMemberList}
  >
    <PartnerMemberManagementComponent />
  </PartnerPageLayout>
);
MemberPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});

export default enhance(MemberPage);
