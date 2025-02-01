import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import cx from 'classnames';
import { CheckCircle } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  },
  card: {
    padding: theme.spacing(5)
  },
  title: {
    textAlign: 'center',
    paddingTop: theme.spacing(5)
  }
}));
const RegisterSuccessPageComponent = ({ t }) => {
  const classes = useStyles();
  return (
    <Grid
      className={classes.root}
      container
      alignItems="center"
      justify="center"
    >
      <div>
        <Grid
          container
          justify="center"
          direction="column"
          alignItems="center"
          className={cx('shadow', classes.card)}
        >
          <img src="../static/coin/eth.png" alt="Logo" width="50%" />
          <Grid container spacing={3} alignItems="center">
            <Typography variant="h4">{t('register_success.title')}</Typography>
            <CheckCircle fontSize="large" style={{ color: 'green' }} />
          </Grid>
          <div className={classes.title}>
            <Typography>
              {t('register_success.label.waitting_approval')}{' '}
            </Typography>
            <div>
              {t('register_success.label.back_to_home')}{' '}
              <a href="/">{t('register_success.label.click_here')}</a>
            </div>
          </div>
        </Grid>
      </div>
    </Grid>
  );
};

export default withTranslation('login-register')(RegisterSuccessPageComponent);
