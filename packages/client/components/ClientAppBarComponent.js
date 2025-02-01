import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { isArray, pick } from 'lodash/fp';

import HeaderUserInfoComponent from './header/HeaderUserInfoComponent';
import {
  makeStyles,
  Grid,
  AppBar,
  Toolbar,
  IconButton
} from '@material-ui/core';
import LanguageSelectComponent from './header/LanguageSelectComponent';
import { Refresh } from '@material-ui/icons';
import { compose } from 'recompose';
import Link from 'next/link';

const doDispatchAction = (dispatch) => (fetchData) => {
  let actionCreators = fetchData;
  if (typeof fetchData === 'function') {
    actionCreators = [fetchData];
  }

  if (isArray(actionCreators)) {
    actionCreators.forEach((actionCreator) => dispatch(actionCreator({})));
  }
};

const connectToRedux = connect(pick(['currentLanguage']), (dispatch) => ({
  refreshData: doDispatchAction(dispatch)
}));

const enhance = compose(connectToRedux, withRouter);

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: theme.spacing(3) // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    marginBottom: theme.spacing(3),
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
  },
  refreshButton: {
    color: 'white'
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 700,
    color: 'white'
  }
}));

const ClientAppbarComponent = ({ isLoggedIn, refreshData, fetchData }) => {
  const classes = useStyles();
  return (
    <AppBar color="primary" position="relative" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        {isLoggedIn && (
          <Fragment>
            <Grid container alignItems="center" className={classes.root}>
              <Link href="/user">
                <div className={classes.title}>RevPayment</div>
              </Link>
            </Grid>
            <Grid className={classes.rightSection}>
              {fetchData && (
                <IconButton
                  className={classes.refreshButton}
                  onClick={() => refreshData(fetchData)}
                >
                  <Refresh />
                </IconButton>
              )}
              <span className={classes.selectLanguageDesk}>
                <LanguageSelectComponent />
              </span>
              <HeaderUserInfoComponent />
            </Grid>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default enhance(ClientAppbarComponent);
