import React from 'react';

import { COIN_ACTIVE, COIN_INACTIVE } from '../enums/status';
import { Lock, LockOpen } from '@material-ui/icons';
import { Grid } from '@material-ui/core';
import { ThemeConsumer } from '../layouts/Theme';

const getCoinStatusLabel = ({ status, t }) => {
  switch (status) {
    case COIN_ACTIVE:
      return t('common:rev_shared.enums.status.coin.active');
    case COIN_INACTIVE:
      return t('common:rev_shared.enums.status.coin.inactive');
    default:
      return '';
  }
};

const getCoinStatusIcon = ({ theme = {}, status }) => {
  switch (status) {
    case COIN_INACTIVE:
      return <Lock fontSize="small" style={{ color: theme.dangerColor }} />;
    case COIN_ACTIVE:
      return (
        <LockOpen fontSize="small" style={{ color: theme.successColor }} />
      );
    default:
      break;
  }
};

const CoinStatusComponent = ({ status, t }) => (
  <ThemeConsumer>
    {theme => (
      <Grid container alignItems="center">
        {getCoinStatusIcon({ theme, status })}
        <span>&nbsp;</span>
        {getCoinStatusLabel({ status, t })}
      </Grid>
    )}
  </ThemeConsumer>
);

export default CoinStatusComponent;
