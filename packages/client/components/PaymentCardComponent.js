import React from 'react';

import CardContentUserTransactionComponent from './CardContentUserTransactionComponent';
import CardFooterUserTransactionComponent from './CardFooterUserTransactionComponent';
import CardHeaderUserPaymentComponent from './CardHeaderUserPaymentComponent';
import CardLayout from './CardLayout';

const PaymentCardComponent = ({ transaction, userId }) => (
  <div className="tx-card col-lg-4">
    <CardLayout
      header={
        <CardHeaderUserPaymentComponent
          transItem={transaction}
          userId={userId}
        />
      }
      footer={<CardFooterUserTransactionComponent transItem={transaction} />}
    >
      <CardContentUserTransactionComponent
        transItem={transaction}
        userId={userId}
      />
    </CardLayout>
    <style jsx>{`
      .tx-card {
        min-height: 320px;
      }
    `}</style>
  </div>
);

export default PaymentCardComponent;
