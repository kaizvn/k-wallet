import React from 'react';
import { Tooltip, IconButton, Grid } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { copyToClipboard } from '../libs';

const getShortenHash = ({ hash = '' }) => {
  return hash.slice(0, 20) + '...';
};

function DisplayHashUrlComponent({
  hashUrl,
  hash,
  shorten = true,
  copyButton = true
}) {
  return (
    <Grid container direction="row" wrap="nowrap" alignItems="center">
      {copyButton && (
        <IconButton onClick={() => copyToClipboard(hash)}>
          <FileCopy fontSize="small" />
        </IconButton>
      )}
      <Tooltip title={hash} aria-label={hash} placement="top">
        <a href={hashUrl} target="_blank" rel="noopener noreferrer">
          {shorten ? getShortenHash({ hash }) : hash}
        </a>
      </Tooltip>
    </Grid>
  );
}

export default DisplayHashUrlComponent;
