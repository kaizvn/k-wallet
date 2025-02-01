import React from 'react';

import HomePageComponent from '../components/HomePageComponent';
import HomePageLayout from '../layouts/HomePageLayout';
import { Grid } from '@material-ui/core';

const IndexPage = () => (
  <Grid>
    <HomePageComponent />
  </Grid>
);
IndexPage.getInitialProps = () => ({
  namespacesRequired: ['common']
});
export default IndexPage;
