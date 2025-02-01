import React from 'react';
import dynamic from 'next/dynamic';

const ReactPasswordStrength = dynamic
  ? dynamic(import('react-password-strength'), {
      ssr: false
    })
  : null;

const ReactPasswordStrengthComponent = ({ ...props }) => (
  <React.Fragment>
    <ReactPasswordStrength {...props} />
    <style jsx global>{`
      .ReactPasswordStrength {
        width: 100%;
        font-size: 16px;
      }

      input.ReactPasswordStrength-input {
        font-size: 16px;
        padding: 12px 0px 12px 14px;
      }

      div.ReactPasswordStrength-strength-bar {
        position: absolute;
        bottom: 1px;
        top: auto;
        right: 0;
      }

      span.ReactPasswordStrength-strength-desc {
        padding: 12px 6px;
        font-style: italic;
        font-size: 90%;
        position: absolute;
        top: 1px;
        text-align: right;
        transition: color 250ms ease-in-out;
        width: 32%;
        right: 12px;
      }
      @media screen and (max-width: 425px) {
        span.ReactPasswordStrength-strength-desc {
          width: 40%;
        }
      }
    `}</style>
  </React.Fragment>
);

export default ReactPasswordStrengthComponent;
