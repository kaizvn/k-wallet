import React from 'react';
import { Tooltip, IconButton, Grid } from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import { copyToClipboard } from '../libs';

const getShortenHash = ({ value = '', charater }) => {
  return value.slice(0, charater) + '...';
};

function ShortenContentComponent({
  value,
  shorten = true,
  copyButton = true,
  charater = 10
}) {
  if (!value) return null;
  return (
    <Grid container direction="row" wrap="nowrap" alignItems="center">
      {copyButton && (
        <IconButton onClick={() => copyToClipboard(value)}>
          <FileCopy fontSize="small" />
        </IconButton>
      )}
      <Tooltip title={value} aria-label={value} placement="top">
        <span>{shorten ? getShortenHash({ value, charater }) : value}</span>
      </Tooltip>
    </Grid>
  );
}

export default ShortenContentComponent;
