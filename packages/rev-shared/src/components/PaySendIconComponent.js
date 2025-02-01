import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PaySendIconComponent = ({ isPartner, size = 48 }) => {
  return (
    <div className="ks-user">
      <div className="ks-avatar btn-royal-blue">
        <span className="mt-2 mb-2">
          {isPartner ? (
            <FontAwesomeIcon icon={['fas', 'store-alt']} />
          ) : (
            <FontAwesomeIcon icon={['fas', 'user']} />
          )}
        </span>
      </div>
      <style jsx>{`
        .ks-user {
          flex-direction: row;
          text-align: center;
          margin: 12px 0;
          font-size: ${size}px;
        }

        .ks-avatar {
          width: 100px;
          height: 100px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
        }

        .ks-avatar > span {
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default PaySendIconComponent;
