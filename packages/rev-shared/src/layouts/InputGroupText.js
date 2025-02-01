import React from 'react';
import cx from 'classnames';

import { generateIDFromLabel } from '../libs';

const GroupIcon = ({ icon, iconRight }) => (
  <div
    className={cx({
      'input-group-prepend': !iconRight,
      'input-group-append': iconRight
    })}
  >
    <span className="input-group-text" id="basic-addon1">
      <span className={`la la-${icon}`} />
    </span>
  </div>
);

const InputGroupText = React.forwardRef(
  (
    {
      label,
      large,
      small,
      value,
      onChange,
      iconRight,
      icon,
      error,
      disabled,
      ...others
    },
    ref
  ) => (
    <div className="input-group">
      {!iconRight && <GroupIcon icon={icon} />}
      <input
        id={generateIDFromLabel(label)}
        className={cx({
          'form-control': true,
          'form-control-lg': large,
          'form-control-sm': small,
          'form-control-danger': error
        })}
        ref={ref}
        type="text"
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.currentTarget.value)}
        {...others}
      />
      {iconRight && <GroupIcon icon={icon} iconRight={iconRight} />}
    </div>
  )
);

export default InputGroupText;
