import React from 'react';

import { TextField } from '@material-ui/core';

const InputText = React.forwardRef(
  ({ label, onChange, disabled, ...others }, ref) => (
    <TextField
      ref={ref}
      fullWidth
      label={label}
      onChange={e => onChange(e.currentTarget.value)}
      disabled={disabled}
      variant="outlined"
      {...others}
    />
  )
);

export default InputText;
