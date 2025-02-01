import React from 'react';
import { Button, RLink } from '../../layouts';
import { withTranslation } from '../i18n';
import { CheckCircleSharp } from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import { ThemeConsumer } from '../layouts/Theme';
const DoSuccessComponent = ({ message, t }) => (
  <ThemeConsumer>
    {theme => (
      <Grid container justify="center" direction="column" alignItems="center">
        <CheckCircleSharp style={{ color: theme.successColor, fontSize: 72 }} />
        <div style={{ color: theme.successColor, paddingBottom: 16 }}>
          {message}
        </div>
        <RLink href="/">
          <Button>{t('rev_shared.do_success.label')}</Button>
        </RLink>
      </Grid>
    )}
  </ThemeConsumer>
);

export default withTranslation('common')(DoSuccessComponent);
