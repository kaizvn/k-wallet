import React from 'react';
import cx from 'classnames';

const RenderFieldWithIconComponent = ({
  input,
  type,
  col,
  placeholder,
  icon,
  meta: { touched, error },
  ...others
}) => (
  <React.Fragment>
    <div
      className={cx({
        [`col-${col}`]: col,
        [`col-md-${col}`]: col
      })}
    >
      <div className="input-group icon icon-lg icon-color-primary">
        <div className="input-group-prepend">
          <span className="input-group-text">
            <span className={cx('la', { [`la-${icon}`]: icon })} />
          </span>
        </div>
        <input
          {...input}
          type={type}
          placeholder={placeholder}
          className="form-control"
          {...others}
        />
      </div>
      {touched && error && <span className="error">{error}</span>}
    </div>
    <style jsx>{`
      .error {
        color: red;
      }
    `}</style>
  </React.Fragment>
);

export default RenderFieldWithIconComponent;
