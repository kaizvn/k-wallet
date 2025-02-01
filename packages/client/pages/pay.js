import React from 'react';

import AuthenHOC from '../components/HOC/AuthenHOC';
import { EmptyPageLayout } from '@revtech/rev-shared/layouts';
import PayComponent from '../components/PayComponent';

const UserPayPage = ({ id, partnerId, ...rootProps }) => (
  <EmptyPageLayout {...rootProps}>
    <link
      rel="stylesheet"
      type="text/css"
      href="/static/kosmo/assets/styles/pricing/subscriptions.min.css"
    />

    <PayComponent id={id} partnerId={partnerId} />
  </EmptyPageLayout>
);

UserPayPage.getInitialProps = (ctx) => {
  const {
    query: { partnerId, id }
  } = ctx;

  return {
    partnerId,
    id
  };
};

export default AuthenHOC(UserPayPage);
