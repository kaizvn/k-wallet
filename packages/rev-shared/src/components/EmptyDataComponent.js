import React from 'react';
const EmptyDataComponent = ({ message }) => (
  <div className="empty-data row">
    <div className="m-auto">
      <h1 className="badge badge-default m-4 p-2">{message}</h1>
    </div>
    <style jsx>
      {`
        .empty-data {
          width: 100%;
        }
        .shadow {
          padding: 30px 35px;
        }
      `}
    </style>
  </div>
);

export default EmptyDataComponent;
