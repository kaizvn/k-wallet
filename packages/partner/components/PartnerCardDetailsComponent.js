import {
  PartnerStatusComponent,
  AvatarComponent
} from '@revtech/rev-shared/components';
import { RLink, Button } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React, { Fragment } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  currentPartnerSelector,
  currentUserSelector
} from '../stores/UserState';
import {
  Grid,
  makeStyles,
  Card,
  CardContent,
  Typography,
  Divider,
  CardHeader,
  Chip
} from '@material-ui/core';
import cx from 'classnames';
const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    currentPartner: currentPartnerSelector
  }),
  null
);

const useStyles = makeStyles(theme => ({
  card: {
    minWidth: 280,
    margin: 'auto',
    transition: '0.3s',
    padding: theme.spacing(2, 1)
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
  heading: {
    fontWeight: 'bold'
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

const PartnerCardDetailsComponent = ({ currentUser, currentPartner, t }) => {
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
          title={t('card_detail.title')}
          subheader={
            <Fragment>
              {t('card_detail.valid_from')}{' '}
              <Moment format="MM/DD/YYYY">
                {new Date(currentUser.createdAt)}
              </Moment>
            </Fragment>
          }
        />
        <Grid className={classes.avatar} container justify="center">
          <AvatarComponent url="https://placekitten.com/100/100" large />
        </Grid>
        <CardContent className={classes.content}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} className={classes.textCenter}>
              <Typography
                className={'MuiTypography--heading'}
                variant={'h6'}
                gutterBottom
              >
                {currentPartner.name}
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

          <Divider className={classes.divider} light />
          <Grid container justify="space-between">
            <Chip
              size="small"
              label={currentUser.partnerUserRole}
              clickable
              color="primary"
            />
            <Grid item>
              <Grid container direction="row" alignItems="center">
                <div>{t('card_detail.status')}: </div>
                <PartnerStatusComponent t={t} status={currentUser.status} />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  );
};
export default enhance(PartnerCardDetailsComponent);
