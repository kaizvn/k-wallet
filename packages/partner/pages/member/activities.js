import React from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));
const PartnerActivitiesPage = ({ t, ...rootProps }) => (
  <PartnerPageLayout {...rootProps} title={t('page_header.member.activity')}>
    <div> underconstruction </div>
  </PartnerPageLayout>
);

PartnerActivitiesPage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout']
});

export default enhance(PartnerActivitiesPage);
