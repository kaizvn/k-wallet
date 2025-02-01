import { connect } from 'react-redux';
import Link from 'next/link';
import React from 'react';

import { TOGGLE_SIDEBAR } from '../../stores/NavigationState';
import { pick } from 'lodash/fp';
import { Grid, makeStyles } from '@material-ui/core';

const connectToRedux = connect(pick(['showSidebar']), dispatch => ({
  sidebarToggle: value =>
    dispatch({
      type: TOGGLE_SIDEBAR,
      payload: value
    })
}));

const useStyles = makeStyles(theme => ({
  root: {
    padding: `0px ${theme.spacing(2)}px`
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 18,
    fontWeight: 700
  }
}));

const HeaderTitleComponent = () => {
  const classes = useStyles();
  return (
    <Grid container alignItems="center" className={classes.root}>
      <Link href="/">
        <div className={classes.title}>RevPayment</div>
      </Link>
    </Grid>
  );
};

export default connectToRedux(HeaderTitleComponent);
