import React from 'react';
import AuthenHOC from '../components/HOC/AuthenHOC';
import { EmptyPageLayout } from '@revtech/rev-shared/layouts';
import SendComponent from '../components/SendComponent';
import { compose } from 'recompose';
import { withTranslation } from '@revtech/rev-shared/i18n';

const enhance = compose(withTranslation('user-page-layout'), AuthenHOC);
const UserSendPage = ({ id, partnerId, t, ...rootProps }) => (
  <EmptyPageLayout {...rootProps} title={t('page_header.user.transfer')}>
    <link
      rel="stylesheet"
      type="text/css"
      href="/static/kosmo/assets/styles/pricing/subscriptions.min.css"
    />
    <SendComponent id={id} partnerId={partnerId} />
  </EmptyPageLayout>
);

UserSendPage.getInitialProps = (ctx) => {
  const {
    query: { partnerId, id }
  } = ctx;

  return {
    partnerId,
    id,
    namespacesRequired: []
  };
};

export default enhance(UserSendPage);
