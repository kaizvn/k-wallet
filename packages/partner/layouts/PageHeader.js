import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import React from 'react';

import {
  compact,
  flow,
  isArray,
  join,
  map,
  split,
  upperFirst,
  pick
} from 'lodash/fp';

import {
  Grid,
  Breadcrumbs,
  Typography,
  makeStyles,
  IconButton
} from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import cx from 'classnames';

const formatPathName = flow(split('/'), compact, map(upperFirst), join(' / '));

const doDispatchAction = dispatch => fetchData => {
  let actionCreators = fetchData;
  if (typeof fetchData === 'function') {
    actionCreators = [fetchData];
  }

  if (isArray(actionCreators)) {
    actionCreators.forEach(actionCreator => dispatch(actionCreator({})));
  }
};

const connectToRedux = connect(
  pick(['drawerWidth', 'showSidebar']),
  dispatch => ({
    refreshData: doDispatchAction(dispatch)
  })
);
const enhance = compose(connectToRedux, withRouter);

const useStyles = drawerWidth =>
  makeStyles(theme => ({
    pageHeaderShort: {
      padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
      position: 'fixed',
      top: theme.mixins.toolbar.minHeight,
      width: `calc(100% - ${drawerWidth}px)`,
      zIndex: theme.zIndex.drawer,
      background: 'white',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
      [theme.breakpoints.down('sm')]: {
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`
      }
    },
    pageHeaderLong: {
      width: '100%'
    },
    subTitle: {
      color: '#858585'
    }
  }));

const PageHeader = ({
  title,
  router,
  fetchData,
  refreshData,
  drawerWidth,
  showSidebar
}) => {
  const classes = useStyles(drawerWidth)();
  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={cx(
        classes.pageHeaderShort,
        !showSidebar && classes.pageHeaderLong
      )}
    >
      <Grid>
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="textPrimary">
            {formatPathName(router.pathname)}
          </Typography>
        </Breadcrumbs>
        <Typography className={classes.subTitle} variant="body2">
          {title}
        </Typography>
      </Grid>
      {fetchData && (
        <IconButton color="primary" onClick={() => refreshData(fetchData)}>
          <Refresh />
        </IconButton>
      )}
    </Grid>
  );
};

export default enhance(PageHeader);
