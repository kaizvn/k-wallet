import React from 'react';

import CardContentUserTransactionComponent from './CardContentUserTransactionComponent';
import CardHeaderUserTransactionComponent from './CardHeaderUserTransactionComponent';
import CardFooterUserTransactionComponent from './CardFooterUserTransactionComponent';
import CardLayout from './CardLayout';

const TransactionCardComponent = ({ transaction, userId }) => (
  <div className="tx-card col-lg-4">
    <CardLayout
      header={
        <CardHeaderUserTransactionComponent
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

export default TransactionCardComponent;
