import React from 'react';
import cx from 'classnames';

import { makeStyles, Avatar } from '@material-ui/core';
const getSizeNameBySize = ({ small, medium, large }) => {
  switch (true) {
    case small:
      return 'small';
    case medium:
      return 'medium';
    case large:
      return 'large';
    default:
      return 'medium';
  }
};

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  medium: {
    width: theme.spacing(6),
    height: theme.spacing(6)
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10)
  }
}));
const AvatarComponent = ({
  url = '',
  small,
  medium,
  large,
  alt,
  className,
  icon = false,
  ...others
}) => {
  const sizeName = getSizeNameBySize({ small, medium, large });
  const classes = useStyles();
  const defaultImg =
    url ||
    (icon
      ? '/static/images/icon-default.png'
      : '/static/images/avatar-default.png');
  return (
    <Avatar
      component="span"
      alt={alt}
      src={defaultImg}
      className={cx(classes[sizeName], className)}
      {...others}
    />
  );
};
export default AvatarComponent;
