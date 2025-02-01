import React from 'react';
import cx from 'classnames';

import { withTranslation } from '../../i18n';
import { roundFloat } from '../../utils/exchanges';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import AvatarComponent from '../../components/AvatarComponent';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 1, 3, 3),
    margin: theme.spacing(2, 0)
  },
  avatar: {
    borderRadius: '50%',
    marginRight: theme.spacing(3)
  },
  balance: {
    fontSize: theme.spacing(3),
    fontWeight: 600,
    display: 'inline-block'
  },
  badge: {
    background: '#eff1fc',
    color: 'black',
    padding: 6
  }
}));

const OwnerDataComponent = ({ children }) => (
  <React.Fragment>{children.name || children.fullName}</React.Fragment>
);
const WalletDetailsCardComponent = ({ ewallet, style, t }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      wrap="wrap"
      alignItems="center"
      className={cx(classes.root, 'shadow')}
    >
      <div className={classes.avatar} style={style}>
        {ewallet.coin.logo ? (
          <AvatarComponent url={ewallet.coin.logo} alt="" large />
        ) : (
          <AvatarComponent icon alt="" large />
        )}
      </div>

      <Grid>
        <div>
          {t('rev_shared.ewallet.id')}: {ewallet.coin.id}
        </div>
        <div>
          {t('rev_shared.ewallet.owner')}:{' '}
          <OwnerDataComponent>{ewallet.owner}</OwnerDataComponent>
        </div>
        <div className="">
          <span className={classes.balance}>{roundFloat(ewallet.balance)}</span>
        </div>
        <Typography className={classes.badge} variant="button">
          {ewallet.coin.name}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withTranslation('common')(WalletDetailsCardComponent);
