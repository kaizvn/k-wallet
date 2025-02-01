import React from 'react';
import cx from 'classnames';

import { ThemeConsumer } from './Theme';
import { generateIDFromLabel } from '../libs';

const NormalCheckbox = React.forwardRef(
  ({ checked, onChange, secondary, label, disabled }, ref) => (
    <ThemeConsumer>
      {theme => (
        <div
          className={cx({
            'custom-control': true,
            'custom-checkbox': true,
            'ks-checkbox': true,
            'sc-checkbox-primary': !secondary,
            'sc-checkbox-secondary': secondary
          })}
        >
          <input
            id={generateIDFromLabel(label)}
            type="checkbox"
            className="custom-control-input"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            ref={ref}
          />
          <label
            className="custom-control-label"
            htmlFor={generateIDFromLabel(label)}
          >
            {label}
          </label>
          <style jsx>{`
            .ks-checkbox.sc-checkbox-primary
              > .custom-control-input:checked
              ~ .custom-control-label:after {
              background: ${theme.primaryColor};
            }
            .ks-checkbox.sc-checkbox-secondary
              > .custom-control-input:checked
              ~ .custom-control-label:after {
              background: ${theme.secondaryColor};
            }
          `}</style>
        </div>
      )}
    </ThemeConsumer>
  )
);

export default NormalCheckbox;
