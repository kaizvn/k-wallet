import {
  FormControl,
  MenuItem,
  makeStyles,
  TextField
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1)
  }
}));
const SelectLayout = ({
  value,
  onChange,
  placeholder,
  options = [],
  label,
  variant = 'outlined',
  size = 'small',
  ...others
}) => {
  const classes = useStyles();

  if (!options.length) {
    return (
      <FormControl
        variant="outlined"
        className={classes.formControl}
      ></FormControl>
    );
  }

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <TextField
        size={size}
        style={{ width: 'fit-content' }}
        {...others}
        select
        label={label}
        value={value}
        onChange={onChange}
        variant={variant}
      >
        {options.map(op => (
          <MenuItem key={op.value} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
};

export default SelectLayout;
