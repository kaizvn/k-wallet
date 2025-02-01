import React from 'react';
import { Button as ButtonLayout, makeStyles } from '@material-ui/core';
import cx from 'classnames';
const useStyles = makeStyles(() => ({
  root: {
    margin: 4
  }
}));

const Button = ({
  children,
  disableElevation = true,
  variant = 'contained',
  color = 'primary',
  className = {},
  ...others
}) => {
  const classes = useStyles();
  return (
    <ButtonLayout
      className={cx(classes.root, className)}
      variant={variant}
      color={color}
      disableElevation={disableElevation}
      {...others}
    >
      {children}
    </ButtonLayout>
  );
};

export default Button;
