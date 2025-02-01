import React from 'react';
import cx from 'classnames';

import { ThemeConsumer } from './Theme';

const Switch = React.forwardRef(
  ({ checked, onChange, secondary, label, disabled, t }, ref) => (
    <ThemeConsumer>
      {theme => (
        <div className="custom-control custom-checkbox">
          <label
            className={cx({
              'ks-checkbox-switch': true,
              'sc-primary': !secondary,
              'sc-secondary': secondary
            })}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              ref={ref}
            />
            <span className="ks-wrapper" />
            <span className="ks-indicator" />
            <span className="ks-on">
              {t('common:rev_shared.switch.status.on')}
            </span>
            <span className="ks-off">
              {t('common:rev_shared.switch.status.off')}
            </span>
          </label>
          <style jsx>{`
            .ks-checkbox-switch.sc-primary
              input[type='checkbox']:checked
              + .ks-wrapper {
              background: ${theme.primaryColor};
            }

            .ks-checkbox-switch.sc-secondary
              input[type='checkbox']:checked
              + .ks-wrapper {
              background: ${theme.secondaryColor};
            }
          `}</style>
        </div>
      )}
    </ThemeConsumer>
  )
);

export default Switch;
