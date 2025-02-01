import React from 'react';

const LoadingComponent = () => (
  <React.Fragment>
    <span className="loader" />
    <style jsx>{`
      .loader {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        position: absolute;
        top: 50%;
        left: calc(50% - 60px);
        transform: translate(-50%, -50%);
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </React.Fragment>
);
export default LoadingComponent;
