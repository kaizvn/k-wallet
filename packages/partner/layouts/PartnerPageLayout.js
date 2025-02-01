import React from 'react';
import PartnerVerticalBarComponent from '../components/PartnerVerticalBarComponent';
import { makeStyles, Grid, CssBaseline, Container } from '@material-ui/core';
import PartnerAppbarComponent from '../components/PartnerAppbarComponent';
import Head from 'next/head';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  main: {
    flexGrow: 1,
    height: '100vh',
    overflowX: 'hidden',
    paddingBottom: theme.spacing(4),
    overflowY: 'auto'
  },
  container: {
    flexWrap: 'unset'
  }
}));

function PartnerPageLayout({
  children,
  isLoggedIn,
  title,
  subTitle,
  fetchData,
  isAppbarTitle = true,
  ...restProps
}) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Head>
        <title>{!!title ? title + ' | RevPayment' : 'RevPayment'}</title>
      </Head>
      {!isLoggedIn ? (
        <Container maxWidth={false} className={classes.container}>
          <PartnerAppbarComponent empty={true} />
          {children}
        </Container>
      ) : (
        <Grid className={classes.root}>
          <CssBaseline />
          <PartnerVerticalBarComponent {...restProps} />
          <main className={classes.main}>
            <Container maxWidth={false} className={classes.container}>
              <PartnerAppbarComponent
                title={isAppbarTitle ? title : null}
                fetchData={fetchData}
              />
              {children}
            </Container>
          </main>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default PartnerPageLayout;
