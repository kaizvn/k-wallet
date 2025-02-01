import React from 'react';

const CardLayout = ({ header, children, footer, style }) => (
  <div
    style={style}
    className="card panel panel-default ks-no-border ks-solid ks-bg-light-gray mt-3"
  >
    <div className=""> {header}</div>
    <div className="card-block"> {children}</div>
    <div className=""> {footer}</div>

    <style jsx>
      {`
        .card {
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.2);
          min-height: 320px;
        }
      `}
    </style>
  </div>
);
export default CardLayout;
