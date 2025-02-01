import React from 'react';

const MaintainComponent = ({ message }) => (
  <div className="ks-column ks-page">
    <div className="ks-page-content">
      <div className="ks-page-content-body ks-error-page">
        <div className="ks-error-code">We&rsquo;ll be back soon!</div>
        <div className="ks-error-description">
          {message || (
            <p>
              Sorry for the inconvenience but we're performing some maintenance
              at the moment, we'll be back online shortly!
            </p>
          )}
        </div>
      </div>
    </div>
    <style jsx>
      {`
        .ks-error-page .ks-error-code {
          font-size: 120px;
        }
        .ks-page-content-body {
          text-align: center;
        }
        .ks-error-page .ks-error-description {
          font-size: 32px;
        }
      `}
    </style>
  </div>
);

export default MaintainComponent;
