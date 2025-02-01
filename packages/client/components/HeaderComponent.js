import React from 'react';

import HeaderTitleComponent from './header/HeaderTitleComponent';
import HeaderUserInfoComponent from './header/HeaderUserInfoComponent';
import LanguageSelectComponent from './header/LanguageSelectComponent';
import { AppBar, Toolbar, Grid, makeStyles } from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  selectLanguageDesk: {
    display: 'block',
    '@media (max-width: 600px)': {
      display: 'none'
    }
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center'
  }
}));

const HeaderComponent = ({ isLoggedIn }) => {
  const classes = useStyles();
  return (
    <AppBar color="primary" position="fixed" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <HeaderTitleComponent />
        {isLoggedIn && (
          <Grid className={classes.rightSection}>
            <span className={classes.selectLanguageDesk}>
              <LanguageSelectComponent />
            </span>
            <HeaderUserInfoComponent />
          </Grid>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default HeaderComponent;
