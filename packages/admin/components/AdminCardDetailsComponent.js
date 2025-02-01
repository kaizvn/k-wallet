import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { RLink, Button } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';

import { currentUserSelector } from '../stores/UserState';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
  Divider
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import cx from 'classnames';

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector
  }),
  null
);
const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 280,
    margin: 'auto',
    transition: '0.3s',
    padding: theme.spacing(1)
  },
  media: {
    paddingTop: '56.25%'
  },
  content: {
    textAlign: 'left',
    padding: theme.spacing(3)
  },
  divider: {
    margin: `${theme.spacing(3)}px 0`
  },
  subheading: {
    lineHeight: 1.8
  },
  avatar: {
    paddingTop: theme.spacing(3)
  },
  textCenter: {
    textAlign: 'center'
  }
}));

const enhance = compose(connectToRedux, withTranslation('dashboard'));
const AdminCardDetailsComponent = ({ currentUser, t }) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Card className={cx(classes.card, 'shadow')} elevation={0}>
        <CardHeader
          avatar={' '}
          action={
            <RLink href="/profile">
              <Button variant="outlined">
                <FontAwesomeIcon icon={['fas', 'user']} />
              </Button>
            </RLink>
          }
          title={<Typography>{t('card_detail.title')}</Typography>}
        />
        <Divider className={classes.divider} light />
        <CardContent className={classes.content}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} className={classes.textCenter}>
              <Typography
                style={{ fontWeight: 700 }}
                className={'MuiTypography--heading'}
                variant={'h5'}
                color="primary"
                gutterBottom
              >
                Rev Payment
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.textCenter}>
              <Typography
                className={'MuiTypography--heading'}
                variant={'h6'}
                gutterBottom
              >
                {currentUser.fullName}
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.textCenter}>
              {t('card_detail.username')}: <b>{currentUser.username}</b>
            </Grid>
            <Grid item xs={12} className={classes.textCenter}>
              <Typography
                className={'MuiTypography--subheading'}
                variant={'caption'}
              >
                {currentUser.email}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default enhance(AdminCardDetailsComponent);
