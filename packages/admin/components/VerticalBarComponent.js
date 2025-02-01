import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import React, { useEffect, Fragment } from 'react';
import cx from 'classnames';

import { pick } from 'lodash/fp';

import { CHANGE_PATH, TOGGLE_SIDEBAR } from '../stores/NavigationState';
import { createLink } from '@revtech/rev-shared/libs';
import { AppBarItemComponent } from '@revtech/rev-shared/components';

import {
  List,
  makeStyles,
  withWidth,
  Drawer,
  Grid,
  Divider,
  IconButton
} from '@material-ui/core';
import Link from 'next/link';
import { MenuOpen } from '@material-ui/icons';

const connectToRedux = connect(
  pick(['showSidebar', 'drawerWidth']),
  dispatch => ({
    changePath: (type, payload) =>
      dispatch({
        type,
        payload
      }),
    dispatchAction: action => dispatch(action()),
    sidebarToggle: value =>
      dispatch({
        type: TOGGLE_SIDEBAR,
        payload: value
      })
  })
);

const useStyles = drawerWidth =>
  makeStyles(theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    },
    drawerPaper: {
      height: '100vh',
      maxHeight: '100vh',
      position: 'relative',
      width: drawerWidth,
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      })
    },
    drawerPaperClose: {
      overflowX: 'hidden',
      whiteSpace: 'nowrap',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      width: 1
    },
    appMenu: {
      padding: theme.spacing(1),
      fontSize: 14
    },
    title: {
      textTransform: 'uppercase',
      fontSize: 18,
      fontWeight: 700,
      color: '#3f50b5',
      padding: theme.spacing(4),
      cursor: 'pointer'
    }
  }));

const enhance = compose(withRouter, withWidth(), connectToRedux);

function VerticalBarComponent(props) {
  const {
    changePath,
    router,
    width,
    navbarStructures = [],
    dispatchAction,
    sidebarToggle,
    showSidebar,
    drawerWidth
  } = props;
  const classes = useStyles(drawerWidth)();

  useEffect(() => {
    changePath(CHANGE_PATH, router.pathname);
  }, [router, changePath]);

  useEffect(() => {
    if (!['md', 'lg', 'xl'].includes(width)) {
      sidebarToggle(false);
    } else {
      sidebarToggle(true);
    }
  }, [width, sidebarToggle]);

  return (
    <Fragment>
      <Drawer
        variant="permanent"
        classes={{
          paper: cx(
            classes.drawerPaper,
            !showSidebar && classes.drawerPaperClose
          )
        }}
        open={showSidebar}
      >
        <Grid container justify="center" alignItems="center" direction="row">
          <Link href="/">
            <div className={classes.title}>RevPayment</div>
          </Link>
          {showSidebar && (
            <IconButton onClick={() => sidebarToggle(false)}>
              <MenuOpen />
            </IconButton>
          )}
        </Grid>
        <Divider />
        <List
          id="scrollbar"
          component="ul"
          className={classes.appMenu}
          disablePadding
        >
          {navbarStructures.map((item, index) => (
            <AppBarItemComponent
              {...item}
              key={index}
              link={!item.subPaths && createLink([item.name])}
              onClick={item.onClick}
              dispatchAction={dispatchAction}
            />
          ))}
        </List>
        <style jsx global>
          {`
            #scrollbar {
              overflow-x: hidden;
            }
            #scrollbar:hover {
              overflow-y: auto;
            }
            #scrollbar::-webkit-scrollbar-track {
              -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
              background-color: #f5f5f5;
            }

            #scrollbar::-webkit-scrollbar {
              width: 4px;
              background-color: #f5f5f5;
            }

            #scrollbar::-webkit-scrollbar-thumb {
              background-color: #949494;
            }
          `}
        </style>
      </Drawer>
    </Fragment>
  );
}

export default enhance(VerticalBarComponent);
