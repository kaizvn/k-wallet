import React from 'react';
import { Grid } from '@material-ui/core';

let Page = require('../public/static/homepage/index.html');
const getHTML = () => Object.assign({}, { __html: Page });

//TODO: merge login pages or display the url more accuracy and more convenient

const HomePage = () => {
  const htmlDoc = getHTML();

  return (
    <Grid>
      <div dangerouslySetInnerHTML={htmlDoc} suppressHydrationWarning={true} />
    </Grid>
  );
};

export default HomePage;
