import React, { useState } from 'react';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { TabsLayout } from '@revtech/rev-shared/layouts';
import AuthenHOC from '../../components/HOC/AuthenHOC';
import PartnerPageLayout from '../../layouts/PartnerPageLayout';
import InvoiceManagementComponent from '../../components/InvoiceManagementComponent';
import InvoiceAddingComponent from '../../components/InvoiceAddingComponent';
import InvoiceClientManagementComponent from '../../components/InvoiceClientManagementComponent';

const enhance = compose(AuthenHOC, withTranslation('partner-page-layout'));

const InvoicePage = ({ t, ...rootProps }) => {
  const [currentTab, setCurrentTab] = useState(0);

  const TABS = [
    {
      label: t('label.invoice.manage'),
      content: <InvoiceManagementComponent />
    },
    {
      label: t('label.invoice.create'),
      content: <InvoiceAddingComponent setCurrentTab={setCurrentTab} />
    },
    {
      label: t('label.invoice.client'),
      content: (
        <InvoiceClientManagementComponent setCurrentTab={setCurrentTab} />
      )
    }
  ];

  return (
    <PartnerPageLayout
      {...rootProps}
      isLoggedIn={true}
      isAppbarTitle={false}
      title={t('page_header.invoice.index')}
    >
      <TabsLayout
        setDefaultTab={setCurrentTab}
        defaultTab={currentTab}
        tabs={TABS}
      ></TabsLayout>
    </PartnerPageLayout>
  );
};
InvoicePage.getInitialProps = async () => ({
  namespacesRequired: ['partner-page-layout', 'invoice']
});
export default enhance(InvoicePage);
