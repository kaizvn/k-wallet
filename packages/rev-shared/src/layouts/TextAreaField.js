import React from 'react';
import cx from 'classnames';

import { generateIDFromLabel } from '../libs';

const TextAreaField = React.forwardRef(
  (
    {
      label,
      error,
      large,
      small,
      value,
      onChange,
      children,
      disabled,
      rows = 5,
      ...others
    },
    ref
  ) => (
    <div className={cx({ 'form-group': true, row: true, 'has-danger': error })}>
      <label
        htmlFor={generateIDFromLabel(label)}
        className="col-sm-3 form-control-label"
      >
        <span>{label}</span>
      </label>
      <div className={cx({ 'col-sm-9': true })}>
        <textarea
          rows={rows}
          id={generateIDFromLabel(label)}
          ref={ref}
          disabled={disabled}
          className={cx({
            'form-control': true,
            'form-control-lg': large,
            'form-control-sm': small,
            'form-control-danger': error
          })}
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
          {...others}
        />
        {children}
      </div>
    </div>
  )
);

export default TextAreaField;
