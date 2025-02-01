import { copyToClipboard } from '@revtech/rev-shared/libs';
import React from 'react';

import {
  makeStyles,
  Divider,
  IconButton,
  TextField,
  Grid,
  InputLabel
} from '@material-ui/core';
import { FileCopy } from '@material-ui/icons';
import cx from 'classnames';
const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flexGrow: 1
  },
  input: {
    paddingLeft: theme.spacing(1),
    flex: 1,
    backgroundColor: theme.palette.common.white,
    boxShadow: '0px 5px 10px rgba(30, 30, 32, 0.1)',
    color: ' #1E1E20',
    '& fieldset': {
      border: 'none'
    }
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  iconSection: {
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    color: 'rgba(30, 30, 32, 0.85)',
    fontSize: '1.2rem',
    fontWeight: '600',
    padding: '0.5rem 0 0.25rem'
  }
}));

export default function CopyTextComponent({
  text,
  label,
  rootStyles = {},
  showLabel = false,
  ...others
}) {
  const classes = useStyles();

  return (
    <Grid className={cx(classes.root)} style={rootStyles}>
      {showLabel && (
        <InputLabel shrink color="primary" className={classes.label}>
          {label}
        </InputLabel>
      )}
      <TextField
        fullWidth
        margin="dense"
        label={!showLabel ? label : ''}
        variant="outlined"
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{
          label: 'Master wallet',
          className: classes.input,
          endAdornment: (
            <Grid className={classes.iconSection}>
              <Divider className={classes.divider} orientation="vertical" />
              <IconButton
                onClick={() => {
                  copyToClipboard(text);
                }}
                color="primary"
                className={classes.iconButton}
                aria-label="directions"
              >
                <FileCopy />
              </IconButton>
            </Grid>
          )
        }}
        disabled
        value={text || ''}
        {...others}
      />
    </Grid>
  );
}
