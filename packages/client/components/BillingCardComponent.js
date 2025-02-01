import React from 'react';

import CardContentUserBillingComponent from './CardContentUserBillingComponent';
import CardHeaderUserBillingComponent from './CardHeaderUserBillingComponent';
import CardFooterUserBillingComponent from './CardFooterUserBillingComponent';
import CardLayout from './CardLayout';

const BillingCardComponent = ({ bill = {} }) => (
  <div className="tx-card col-lg-6">
    <CardLayout
      header={<CardHeaderUserBillingComponent billItem={bill} />}
      footer={<CardFooterUserBillingComponent billItem={bill} />}
    >
      <CardContentUserBillingComponent billItem={bill} />
    </CardLayout>
    <style jsx>{`
      .tx-card {
        min-height: 320px;
      }
    `}</style>
  </div>
);

export default BillingCardComponent;
