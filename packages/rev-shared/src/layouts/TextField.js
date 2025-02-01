import React from 'react';
import cx from 'classnames';

import InputGroupText from './InputGroupText';
import InputText from './InputText';
import { makeStyles, InputLabel } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  filled: {
    '& .MuiInputBase-input': {
      backgroundColor: theme.palette.common.white,
      boxShadow: '0px 5px 10px rgba(30, 30, 32, 0.1)',
      minHeight: '24px'
    },
    '& .MuiFilledInput-underline:before': {
      borderColor: `${theme.palette.common.white} !important`
    }
  },
  expandLabel: {
    '& .MuiInputBase-input': {
      padding: '12px'
    }
  },
  label: {
    color: 'rgba(30, 30, 32, 0.85)',
    fontSize: '1.2rem',
    fontWeight: '600',
    padding: '0.5rem 0 0.25rem'
  }
}));

const TextField = ({
  label,
  children,
  icon,
  iconRight,
  error,
  type = 'text',
  onChange,
  expandLabel,
  variant = 'outlined',
  ...others
}) => {
  const classes = useStyles();
  return (
    <div className={cx({ 'form-group': true, row: true, 'has-danger': error })}>
      {expandLabel && (
        <InputLabel shrink className={classes.label}>
          {label}
        </InputLabel>
      )}
      <div className={cx({ 'col-sm-9': true })}>
        {icon ? (
          <InputGroupText
            margin="dense"
            label={!expandLabel ? label : ''}
            error={error}
            icon={icon}
            type={type}
            className={cx(
              variant === 'filled' && classes.filled,
              expandLabel && classes.expandLabel
            )}
            onChange={value => onChange(value)}
            {...others}
          />
        ) : (
          <InputText
            margin="dense"
            label={!expandLabel ? label : ''}
            error={error}
            type={type}
            variant={variant}
            className={cx(
              variant === 'filled' && classes.filled,
              expandLabel && classes.expandLabel
            )}
            onChange={value => onChange(value)}
            {...others}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default TextField;
