import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { withTranslation } from '../../dist/i18n';
import { ThemeConsumer } from '../layouts/Theme';

const EmptyWalletMessageComponent = ({ t, children }) => (
  <ThemeConsumer>
    {theme => (
      <Grid container justify="center">
        <Typography
          style={{
            padding: '24px 0px',
            color: theme.primaryColor
          }}
          variant="h4"
        >
          {children || t('rev_shared.message.empty_ewallet')}
        </Typography>
      </Grid>
    )}
  </ThemeConsumer>
);

export default withTranslation('common')(EmptyWalletMessageComponent);
