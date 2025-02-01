import React from 'react';

import { generateIDFromLabel } from '../libs';
import { TextField, MenuItem } from '@material-ui/core';

const SelectField = React.forwardRef(
  (
    {
      options = [],
      label,
      variant = 'outlined',
      size = 'small',
      onChange,
      value,
      ...others
    },
    ref
  ) => {
    if (!options.length) {
      return null;
    }
    return (
      <TextField
        id={generateIDFromLabel(label)}
        label={label}
        size={size}
        variant={variant}
        fullWidth
        ref={ref}
        select
        onChange={e => onChange(e.target.value)}
        {...others}
        value={value}
      >
        {options.map(op => (
          <MenuItem key={op.value} value={op.value}>
            {op.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }
);

export default SelectField;
