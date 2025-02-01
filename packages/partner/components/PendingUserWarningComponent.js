import React from 'react';

const PendingUserWarningComponent = ({ currentUser }) => (
  <div>
    <span className="card-text text-danger">
      Your account wasn't verified yet.
      <br />
      Please go to{' '}
      <a
        href={`https://submitkyc.dirolabs.com/${currentUser.mccCode}/${
          currentUser.phone
        }`}
      >
        Diro
      </a>{' '}
      and submit document.
    </span>
  </div>
);

export default PendingUserWarningComponent;
