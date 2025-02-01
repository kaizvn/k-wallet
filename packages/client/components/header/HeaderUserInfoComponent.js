import { RLink } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React, { useState, useEffect } from 'react';

import { currentUserSelector, doLogout } from '../../stores/UserState';
import {
  IconButton,
  Menu,
  makeStyles,
  Divider,
  MenuItem,
  Typography
} from '@material-ui/core';
import {
  AccountCircle,
  PersonOutline,
  ExitToApp,
  Settings,
  HelpOutline
} from '@material-ui/icons';
import LanguageSelectComponent from '../header/LanguageSelectComponent';

const connectToRedux = connect(
  createStructuredSelector({
    user: currentUserSelector
  }),
  dispatch => ({
    logout: () => dispatch(doLogout())
  })
);
const enhance = compose(connectToRedux, withTranslation('user-page-layout'));

const useStyles = makeStyles(theme => ({
  accountName: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: '6px 36px',
    outline: 'none'
  },
  selectLanguageMobile: {
    display: 'none',
    '@media (max-width: 600px)': {
      display: 'block'
    }
  },
  menuItem: {
    color: '#25252a',
    '&:hover': {
      color: '#3f51b5'
    },
    height: theme.spacing(6),
    fontSize: 14
  }
}));

//TODO : set scope in redux
const HeaderUserInfoComponent = ({ user, logout, t }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {}, [anchorEl]);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <div className={classes.accountName}>
          <Typography variant="button" display="block" gutterBottom>
            {user ? user.fullName : ' Anonymous'}
          </Typography>
          <Typography variant="body2" display="block" gutterBottom>
            {t('options.customer')}
          </Typography>
        </div>
        <Divider />
        <MenuItem className={classes.selectLanguageMobile}>
          <LanguageSelectComponent handleClose={handleClose} />
        </MenuItem>
        <RLink href="/user/profile">
          <MenuItem className={classes.menuItem} onClick={handleClose}>
            <PersonOutline fontSize="small" /> <div>&nbsp;&nbsp;</div>{' '}
            {t('options.profile')}
          </MenuItem>
        </RLink>
        <RLink href="/setting">
          <MenuItem className={classes.menuItem} onClick={handleClose}>
            <Settings fontSize="small" /> <div>&nbsp;&nbsp;</div>{' '}
            {t('options.settings')}
          </MenuItem>
        </RLink>
        <RLink href="">
          <MenuItem className={classes.menuItem} onClick={handleClose}>
            <HelpOutline fontSize="small" /> <div>&nbsp;&nbsp;</div>{' '}
            {t('options.help')}
          </MenuItem>
        </RLink>
        <MenuItem className={classes.menuItem} onClick={logout}>
          <ExitToApp />
          <div>&nbsp;&nbsp;</div> {t('options.logout')}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default enhance(HeaderUserInfoComponent);
