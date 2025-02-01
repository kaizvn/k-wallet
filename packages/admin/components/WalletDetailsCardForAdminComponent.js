import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  Grid,
  Typography,
  makeStyles,
  Divider,
  IconButton,
  Tooltip,
  Checkbox
} from '@material-ui/core';
import { AvatarComponent } from '@revtech/rev-shared/components';
import { EXCHANGES } from '@revtech/rev-shared/utils';
import { Sync } from '@material-ui/icons';
const { roundFloat } = EXCHANGES;

const OwnerDataComponent = ({ children }) => (
  <React.Fragment>{children.name || children.fullName}</React.Fragment>
);

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 3, 3, 3),
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
  },
  name: {
    padding: theme.spacing(1)
  },
  header: {
    padding: 2
  }
}));

const WalletDetailsCardForAdminComponent = ({
  ewallet = {},
  t,
  key,
  syncEWallet,
  syncEWalletData,
  syncEWalletError,
  setArrayEWalletId,
  resetSyncEWalletData,
  isDisableSyncButton = false,
  isSynchronizingMultiple = false,
  arrayEWalletsUpdating = []
}) => {
  const classes = useStyles();
  const [disableSyncBalance, setDisableSyncBalance] = useState(
    isDisableSyncButton
  );

  useEffect(() => {
    if (!isEmpty(syncEWalletError) || !isEmpty(syncEWalletData)) {
      setDisableSyncBalance(false);
      resetSyncEWalletData();
    }
  }, [syncEWalletError, syncEWalletData, resetSyncEWalletData]);

  useEffect(() => {
    if (
      ewallet.isSynchronizing ||
      (isSynchronizingMultiple && arrayEWalletsUpdating.includes(ewallet.id))
    ) {
      setDisableSyncBalance(true);
    } else {
      setDisableSyncBalance(false);
    }
  }, [
    ewallet.isSynchronizing,
    isSynchronizingMultiple,
    arrayEWalletsUpdating,
    ewallet.id
  ]);

  return (
    <Grid className={'shadow'} key={key}>
      <Grid
        className={classes.header}
        container
        justify="space-between"
        alignItems="center"
      >
        <Typography className={classes.name}>
          {' '}
          {ewallet.name || '--'}
        </Typography>
        <Grid>
          <Checkbox
            disabled={disableSyncBalance}
            checked={arrayEWalletsUpdating.includes(ewallet.id)}
            onChange={event => {
              if (event.target.checked) {
                setArrayEWalletId(prev => [...prev, ewallet.id]);
              } else {
                setArrayEWalletId(prev =>
                  (prev || []).filter(id => id !== ewallet.id)
                );
              }
            }}
            color="primary"
          />
          <Tooltip title={t('ewallet.renew_deposit_adr.tooltip_sync')}>
            <IconButton
              disabled={disableSyncBalance}
              onClick={() => {
                syncEWallet({ arrayId: [ewallet.id] });
                setDisableSyncBalance(true);
              }}
            >
              <Sync fontSize="small" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Divider style={{ width: '100%' }} />
      <Grid
        container
        direction="row"
        wrap="wrap"
        alignItems="center"
        className={classes.root}
      >
        <div className={classes.avatar}>
          {ewallet.coin.logo ? (
            <AvatarComponent url={ewallet.coin.logo} alt="" large />
          ) : (
            <AvatarComponent icon alt="" large />
          )}
        </div>

        <Grid>
          <div>
            {t('rev_shared.ewallet.owner')}:{' '}
            <OwnerDataComponent>{ewallet.owner}</OwnerDataComponent>
          </div>
          <div className="">
            <span className={classes.balance}>
              {roundFloat(ewallet.balance)}
            </span>
          </div>
          <Typography className={classes.badge} variant="button">
            {ewallet.coin.symbol}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default withTranslation('common')(WalletDetailsCardForAdminComponent);
