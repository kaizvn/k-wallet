import React from 'react';
import {
  List,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListItem,
  makeStyles
} from '@material-ui/core';
import {
  ExpandMore as IconExpandMore,
  ExpandLess as IconExpandLess
} from '@material-ui/icons';
import { RLink } from '@revtech/rev-shared/layouts';
import { useRouter } from 'next/router';
import cx from 'classnames';
import { createLink } from '@revtech/rev-shared/libs';

const MenuItem = props => {
  const { className, onClick, children, link } = props;

  if (!link || typeof link !== 'string') {
    return (
      <ListItem
        button
        className={className}
        children={children}
        onClick={onClick}
      />
    );
  }
  return (
    <RLink href={link || '/'}>
      <ListItem button className={className} children={children} to={link} />
    </RLink>
  );
};

const AppBarItemComponent = ({
  label,
  link,
  onClick,
  icon,
  subPaths = [],
  isChild = false,
  name,
  dispatchAction
}) => {
  const router = useRouter();
  const classes = useStyles();
  const isExpandable = subPaths && subPaths.length > 0;
  const [open, setOpen] = React.useState(true);
  let finalLink = link;
  if (!onClick && link === '') {
    finalLink = '/';
  }

  function handleClick() {
    setOpen(!open);
  }

  const MenuItemRoot = (
    <MenuItem
      className={cx(classes.menuItem, classes.aTag)}
      link={finalLink}
      onClick={() => {
        handleClick();
        if (onClick && typeof dispatchAction === 'function') {
          dispatchAction(onClick);
        }
      }}
    >
      {!!icon && (
        <ListItemIcon className={classes.menuItemIcon}>{icon}</ListItemIcon>
      )}
      <ListItemText
        disableTypography
        className={cx(
          !isChild ? classes.menuItemLabel : classes.subMenuItemLabel,
          router.pathname === finalLink && classes.menuItemActive
        )}
        primary={label}
        inset={!icon}
      />
      {isExpandable && !open && <IconExpandMore />}
      {isExpandable && open && <IconExpandLess />}
    </MenuItem>
  );

  const MenuItemChildren = isExpandable ? (
    <Collapse
      in={router.pathname === finalLink || open}
      timeout="auto"
      unmountOnExit
    >
      {subPaths && (
        <List component="div" disablePadding>
          {subPaths.map((item, index) => (
            <AppBarItemComponent
              {...item}
              key={index}
              isChild
              link={createLink([name, item.name])}
              onClick={item.onClick}
            />
          ))}
        </List>
      )}
    </Collapse>
  ) : null;

  return (
    <>
      {MenuItemRoot}
      {MenuItemChildren}
      <style jsx global>
        {`
          #scrollbar > .jss2,
          .jss3 {
            height: auto !important;
          }
        `}
      </style>
    </>
  );
};

const useStyles = makeStyles(theme => ({
  aTag: {
    color: '#546e7a'
  },
  menuItem: {
    borderRadius: 5
  },
  menuItemActive: {
    color: '#5850EC'
  },
  menuItemIcon: {
    paddingRight: theme.spacing(2),
    minWidth: 'unset'
  },
  menuItemLabel: {
    fontWeight: 600
  },
  subMenuItemLabel: {
    paddingLeft: theme.spacing(5)
  }
}));

export default AppBarItemComponent;
