import React, { useEffect, Fragment, useState } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  CopyTextComponent,
  DisplayErrorMessagesComponent,
  QrCodeComponent
} from '@revtech/rev-shared/components';

import { createDepositAddress } from '@revtech/rev-shared/apis/actions';
import {
  depositAddressSelector,
  createDepositAddressErrorSelector
} from '@revtech/rev-shared/apis/selectors';
import { CreateDepositAddressAPIResetter } from '@revtech/rev-shared/apis/resetters';

import { trackingIdSelector } from '../stores/UserState';
import CoinListComponent from './CoinListComponent';
import {
  Grid,
  makeStyles,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Box
} from '@material-ui/core';
import {
  Stop,
  MonetizationOnOutlined,
  ZoomOutMap,
  Schedule
} from '@material-ui/icons';
import { myWalletsSelector, getMyWallets } from '../stores/WalletState';

const getDepositAddress = order => {
  if (!order) {
    return '';
  }
  if (!order.address) {
    return 'This currency is under development';
  }
  return order.address;
};

const connectToRedux = connect(
  createStructuredSelector({
    depositOrder: depositAddressSelector,
    trackingId: trackingIdSelector,
    errorMessages: createDepositAddressErrorSelector,
    ewallets: myWalletsSelector
  }),
  dispatch => ({
    createWallet: values => {
      dispatch(CreateDepositAddressAPIResetter);
      dispatch(createDepositAddress(values));
    },
    getMyEWallets: () => {
      dispatch(getMyWallets());
    },
    resetData: () => dispatch(CreateDepositAddressAPIResetter)
  })
);

const enhance = compose(connectToRedux, withTranslation('transaction'));

export const TransactionsInstructionsDetailsComponent = ({
  icon,
  title,
  content,
  wrap = 'wrap'
}) => (
  <Grid
    style={{ padding: '8px 0' }}
    container
    direction="row"
    justify="flex-start"
    wrap={wrap}
  >
    <span>{icon}</span>
    <Grid style={{ marginLeft: 16 }} item>
      <Grid container>
        <span className="title">{title}</span>
        <span className="content">{content}</span>
      </Grid>
    </Grid>
    <style jsx>
      {`
        .title {
          margin-right: 4px;
          font-size: 1rem;
        }
        .content {
          font-size: 1rem;
          color: #0052b4;
          min-height: 20px;
        }
      `}
    </style>
  </Grid>
);

const DepositInstruction = ({ t, classes, currentCoin = {} }) => {
  const { minimumDeposit = 0, symbol = '' } = currentCoin.coin || {};
  return (
    <Fragment>
      <Box my={2}>
        <Typography variant="h5" color="primary" style={{ fontWeight: 'bold' }}>
          {t('deposit.title')}
        </Typography>
        <Grid container direction="column">
          <Grid item md={6} sm={12}>
            <TransactionsInstructionsDetailsComponent
              icon={<Schedule fontSize="small" />}
              title={t('deposit.instruction.detail.time.title')}
              content={t('deposit.instruction.detail.time.content')}
            />
          </Grid>
          <Grid item md={6} sm={12}>
            <TransactionsInstructionsDetailsComponent
              icon={<ZoomOutMap fontSize="small" />}
              title={t('deposit.instruction.detail.limit.title')}
              content={t('deposit.instruction.detail.limit.content')}
            />
          </Grid>
          <Grid item md={6} sm={12}>
            <TransactionsInstructionsDetailsComponent
              icon={<ZoomOutMap fontSize="small" />}
              title={t('deposit.instruction.detail.minimum.title')}
              content={`${minimumDeposit || 0} ${symbol}`}
            />
          </Grid>
          <Grid item>
            <TransactionsInstructionsDetailsComponent
              icon={<MonetizationOnOutlined fontSize="small" />}
              title={t('deposit.instruction.detail.fee.title')}
              content={t('deposit.instruction.detail.fee.content')}
            />
          </Grid>
        </Grid>
      </Box>
      <Box my={2}>
        <Typography
          variant="subtitle1"
          color="primary"
          className={classes.title2}
        >
          {t('deposit.instruction.title')}
        </Typography>
        <Grid>
          <ListItem disableGutters>
            <ListItemIcon className={classes.listItemIcon}>
              <Stop className={classes.iconPrefix} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={
                <span>
                  {t('deposit.instruction.text.policy.text_normal')}
                  <a href="#">
                    {' '}
                    {t('deposit.instruction.text.policy.text_link')}
                  </a>
                </span>
              }
            />
          </ListItem>
          <ListItem disableGutters>
            <ListItemIcon className={classes.listItemIcon}>
              <Stop className={classes.iconPrefix} fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={t('deposit.instruction.text.note_deposit_address')}
            />
          </ListItem>
        </Grid>
      </Box>
    </Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(2, 1)
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold'
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  listItemIcon: {
    minWidth: theme.spacing(4)
  },
  grow: {
    flexGrow: 1
  },
  iconPrefix: {
    color: '#1E1E20',
    transform: 'rotate(45deg)'
  },
  trackingLabel: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  title2: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  }
}));

const DepositComponent = ({
  depositOrder,
  createWallet,
  trackingId,
  errorMessages,
  t,
  resetData,
  col = 12,
  getMyEWallets,
  ewallets
}) => {
  const [loadingQR, setLoadingQR] = useState(false);
  const [currentCoin, setCurrentCoin] = useState({});
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    getMyEWallets();
  }, [getMyEWallets]);

  useEffect(() => {
    if (depositOrder || (errorMessages && errorMessages.length > 0)) {
      setLoadingQR(false);
    }
  }, [depositOrder, errorMessages]);

  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item sm={12} md={col} lg={12}>
        <div>
          <DepositInstruction
            currentCoin={currentCoin}
            t={t}
            classes={classes}
          />
          <Typography
            variant="subtitle1"
            color="primary"
            className={classes.title2}
          >
            {t('deposit.instruction.deposit_information')}
          </Typography>
          <Grid container spacing={2} direction="column">
            <Grid item md={12} lg={10}>
              <CoinListComponent
                onChange={e => {
                  const walletByCoin =
                    (ewallets || []).find(
                      item => item.coin.id === e.target.value
                    ) || {};
                  setCurrentCoin(walletByCoin);
                  createWallet({
                    coinId: e.target.value,
                    trackingId: trackingId
                  });
                  setLoadingQR(true);
                }}
                label={t('deposit.label.currencies')}
                col={12}
                variant="filled"
                expandLabel={true}
              />
            </Grid>
            <Grid className={classes.grow} item lg={10} md={12} sm={12}>
              <Typography variant="body1" component="span" color="primary">
                <Box mt={2} fontWeight="bold">
                  {t('deposit.label.tracking_id')}: <span>{trackingId}</span>
                </Box>
              </Typography>
            </Grid>
            <Grid className={classes.grow} item lg={10} md={12} sm={12}>
              <CopyTextComponent
                rootStyles={{ padding: 0 }}
                fullWidth
                label={
                  <Fragment>
                    <b>{t('deposit.label.deposit_address.label_bold')}</b>{' '}
                    {t('deposit.label.deposit_address.label_normal')}
                  </Fragment>
                }
                text={getDepositAddress(depositOrder)}
              />
            </Grid>
            <Grid className={classes.grow} lg={10} item md={6} sm={12}>
              {loadingQR ? (
                <CircularProgress />
              ) : (
                depositOrder &&
                depositOrder.address && (
                  <Fragment>
                    <Typography
                      variant="body1"
                      component="p"
                      className={classes.trackingLabel}
                    >
                      {t('deposit.label.scan_qr')}
                    </Typography>
                    <QrCodeComponent
                      text={depositOrder.address}
                      borderQR
                      justify="flex-start"
                    />
                  </Fragment>
                )
              )}
              {errorMessages && (
                <DisplayErrorMessagesComponent messages={errorMessages} />
              )}
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};
export default enhance(DepositComponent);
