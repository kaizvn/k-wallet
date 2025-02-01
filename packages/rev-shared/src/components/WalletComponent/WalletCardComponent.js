import React from 'react';

import { roundFloat } from '../../utils/exchanges';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import AvatarComponent from '../../../dist/components/AvatarComponent';
import cx from 'classnames';

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

const WalletCardComponent = ({ ewallet, style }) => {
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
          <span className={classes.balance}>{roundFloat(ewallet.balance)}</span>
        </div>
        <Typography className={classes.badge} variant="button">
          {ewallet.coin.name}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default WalletCardComponent;
