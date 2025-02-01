import React from 'react';

import { CssBaseline, Grid, makeStyles } from '@material-ui/core';
import ClientAppBarComponent from '../components/ClientAppBarComponent';
import Head from 'next/head';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  main: {
    flexGrow: 1,
    height: '100vh',
    overflowX: 'hidden'
  },
  container: {
    flexWrap: 'unset'
  }
}));

function UserPageLayout({
  children,
  isLoggedIn,
  fetchData,
  title,
  ...restProps
}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Head>
        <title>{!!title ? title + ' | RevPayment' : 'RevPayment'}</title>
      </Head>
      {!isLoggedIn ? (
        <div>
          <ClientAppBarComponent />
          {children}
        </div>
      ) : (
        <Grid>
          <div className={classes.root}>
            <CssBaseline />
            <main className={classes.main}>
              <div>
                <ClientAppBarComponent
                  isLoggedIn={true}
                  fetchData={fetchData}
                  {...restProps}
                />
                {children}
              </div>
            </main>
          </div>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default UserPageLayout;
