import { Button } from '@revtech/rev-shared/layouts';
import { copyToClipboard } from '@revtech/rev-shared/libs';
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CopyTextComponent = ({ text }) => (
  <div className="input-group icon icon-lg icon-color-primary">
    <span className="display-text form-control">{text}</span>
    <div className="input-group-prepend">
      <Button
        type="button"
        onClick={() => {
          copyToClipboard(text);
        }}
      >
        <FontAwesomeIcon icon={['fas', 'copy']} />
      </Button>
    </div>
    <style jsx>{`
      .display-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 154px;
        display: block;
      }
    `}</style>
  </div>
);

export default CopyTextComponent;
