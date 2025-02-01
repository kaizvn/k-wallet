import { Button, AlertDialog, TextField } from '@revtech/rev-shared/layouts';
import {
  DisplayErrorMessagesComponent,
  AvatarComponent
} from '@revtech/rev-shared/components';
import { EXCHANGES } from '@revtech/rev-shared/utils';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { isServer } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React, { useEffect, useState } from 'react';

import { flow, get, isEmpty, toUpper, max } from 'lodash/fp';

import { TransactionsInstructionsDetailsComponent } from './DepositComponent';
import { currentUserSelector } from '../stores/UserState';
import { getWithdrawEstFeeErrorSelector } from '@revtech/rev-shared/apis/selectors';

import { myWalletsSelector, getMyWallets } from '../stores/WalletState';
import {
  getPartnerGeneralSettingDataSelector,
  getPartnerGeneralSetting
} from '../stores/PartnerState';
import {
  withdrawErrorSelector,
  createWithdrawTransaction
} from '../stores/OrdersState';
import CoinListComponent from './CoinListComponent';
import {
  Typography,
  Grid,
  makeStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box
} from '@material-ui/core';
import {
  Schedule,
  MonetizationOnOutlined,
  LabelImportant,
  ZoomOutMap
} from '@material-ui/icons';

/* TODO:
 - errorselector
 - cancel button
*/

const { calculateCurrencyByPercentage } = EXCHANGES;

const connectToRedux = connect(
  createStructuredSelector({
    trackingId: flow(currentUserSelector, get('username')),
    availableWithdrawal: get('availableWithdrawal'),
    ewallets: myWalletsSelector,
    partnerGeneralSetting: getPartnerGeneralSettingDataSelector,
    errorMessagesForCreateWithdraw: withdrawErrorSelector,
    errorMessagesForGetWithdraw: getWithdrawEstFeeErrorSelector
  }),
  dispatch => ({
    doWithdraw: (recipientAddress, amount, trackingId, coinId) =>
      dispatch(
        createWithdrawTransaction({
          recipientAddress,
          amount,
          trackingId,
          coinId
        })
      ),
    getMyEWallets: () => {
      dispatch(getMyWallets());
    },
    getPartnerGeneralSetting: () => {
      dispatch(getPartnerGeneralSetting());
    }
  })
);

const enhance = compose(connectToRedux, withTranslation('transaction'));

const getFinalFee = (amount, feePercentage, feeFixed) => {
  const feeByPercentage = calculateCurrencyByPercentage({
    inputCurrencyAmount: amount,
    percentage: feePercentage
  });
  const finalFee = max([feeFixed, feeByPercentage]);
  if (!isNaN(finalFee)) {
    return finalFee;
  }
  return 0;
};

const calculateTotalWithdraw = (amount, feePercentage, feeFixed) => {
  return (
    parseFloat(amount) +
    parseFloat(getFinalFee(amount, feePercentage, feeFixed))
  );
};

const WithDrawalInstruction = ({ t, currentCoin = {}, transferLimit = 0 }) => {
  const { feePercentage = 0, feeFixed = 0, symbol = '' } =
    currentCoin.coin || {};

  return (
    <React.Fragment>
      <Typography variant="h6" color="primary" style={{ fontWeight: 'bold' }}>
        {t('withdrawal.title')}
      </Typography>
      <Grid container>
        <Grid item md={12} sm={12}>
          <TransactionsInstructionsDetailsComponent
            icon={<Schedule fontSize="small" style={{ color: '#1E1E20' }} />}
            title={t('withdrawal.instruction.detail.time.title')}
            content={t('withdrawal.instruction.detail.time.content')}
            wrap="nowrap"
          />
        </Grid>
        <Grid item>
          <TransactionsInstructionsDetailsComponent
            icon={<ZoomOutMap fontSize="small" style={{ color: '#1E1E20' }} />}
            title={t('withdrawal.instruction.detail.limit.title')}
            content={t('withdrawal.instruction.detail.limit.content', {
              limit: transferLimit
            })}
            wrap="nowrap"
          />
        </Grid>
        <Grid item md={12} sm={12}>
          <TransactionsInstructionsDetailsComponent
            icon={
              <MonetizationOnOutlined
                fontSize="small"
                style={{ color: '#1E1E20' }}
              />
            }
            title={<Grid>{t('withdrawal.label.transaction_fee')}:</Grid>}
            content={t('withdrawal.instruction.detail.fee.value', {
              feePercentage: feePercentage,
              feeFixed: feeFixed,
              symbol: symbol
            })}
            wrap="nowrap"
          />
        </Grid>
      </Grid>
      <style jsx>{`
        .flashit {
          -webkit-animation: flash linear 1.5s;
          animation: flash linear 1.5s;
        }
        @-webkit-keyframes flash {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes flash {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.1;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </React.Fragment>
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
  title2: {
    fontWeight: 'bold',
    marginTop: theme.spacing(3)
  },
  label: {
    fontStyle: 'italic',
    marginBottom: 4
  },
  grow: {
    flexGrow: 1
  }
}));

const WithdrawalComponent = ({
  trackingId,
  doWithdraw,
  ewallets,
  errorMessagesForCreateWithdraw,
  errorMessagesForGetWithdraw,
  t,
  getMyEWallets,
  getPartnerGeneralSetting,
  partnerGeneralSetting = {},
  col = 12
}) => {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [totalWithdraw, setTotalWithdraw] = useState('');
  const [currentCoin, setCurrentCoin] = useState({});
  const [availableAmount, setAvailableAmount] = useState('');
  const [dialogConfirm, setDialogConfirm] = useState(false);
  const [errorAmount, setErrorAmount] = useState('');
  const [errorAddress, setErrorAddress] = useState('');

  useEffect(() => {
    if (!isServer) {
      getMyEWallets();
    }
  }, [getMyEWallets]);

  useEffect(() => {
    if (!isServer) {
      getPartnerGeneralSetting();
    }
  }, [getPartnerGeneralSetting]);

  const classes = useStyles();

  const errorMessages = [
    ...errorMessagesForCreateWithdraw,
    ...errorMessagesForGetWithdraw
  ];
  return (
    <Grid container justify="center" className={classes.root}>
      <Grid item sm={12} md={col} lg={12}>
        <div>
          <WithDrawalInstruction
            t={t}
            currentCoin={currentCoin}
            transferLimit={partnerGeneralSetting.transferLimit}
          />
          <Typography
            variant="subtitle1"
            className={classes.title2}
            color="primary"
          >
            {t('withdrawal.amount.title')}
          </Typography>
          <Box mt={2}>
            <Grid container spacing={3} direction="row" alignItems="center">
              <CoinListComponent
                wallets={ewallets}
                onChange={e => {
                  const walletByCoin =
                    (ewallets || []).find(
                      item => item.coin.id === e.target.value
                    ) || {};
                  setCurrentCoin(walletByCoin);
                  setAvailableAmount(walletByCoin && walletByCoin.balance);
                  setTotalWithdraw(
                    walletByCoin &&
                      calculateTotalWithdraw(
                        withdrawAmount,
                        get('coin.feePercentage')(walletByCoin),
                        get('coin.feeFixed')(walletByCoin)
                      )
                  );
                }}
                col={6}
                label={<span>{t('withdrawal.wallet.title')}</span>}
                variant="filled"
                expandLabel={true}
              />
              <Grid className={classes.grow} item md={6} sm={12}>
                <TextField
                  expandLabel
                  variant="filled"
                  label={t('withdrawal.recipient.title')}
                  value={recipientAddress}
                  onChange={value => {
                    setRecipientAddress(value);
                  }}
                  error={errorAddress ? true : false}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={4}>
            <Grid className={classes.grow} item>
              <TextField
                expandLabel
                variant="filled"
                type="number"
                label={t('withdrawal.amount.title')}
                value={withdrawAmount}
                onChange={value => {
                  setWithdrawAmount(value);
                  setTotalWithdraw(
                    calculateTotalWithdraw(
                      value,
                      get('coin.feePercentage')(currentCoin),
                      get('coin.feeFixed')(currentCoin)
                    )
                  );
                }}
                error={errorAmount ? true : false}
              />
            </Grid>
          </Box>
          <Box mt={2}>
            <Typography variant="body1" component="span" color="primary">
              <Box mt={2} fontWeight="bold">
                {t('withdrawal.amount.label.available')}:{' '}
                <strong>{availableAmount || 0}</strong>{' '}
                {toUpper(get('coin.id')(currentCoin))}
              </Box>
            </Typography>
          </Box>
          <Grid container>
            <Box mt={2}>
              <Typography variant="body1" component="span">
                {t('withdrawal.label.transaction_fee')}:{' '}
                <strong>
                  {getFinalFee(
                    withdrawAmount,
                    get('coin.feePercentage')(currentCoin),
                    get('coin.feeFixed')(currentCoin)
                  )}{' '}
                  {toUpper(get('coin.id')(currentCoin))}
                </strong>
              </Typography>
            </Box>
            <Box m={2}>
              <Typography variant="body1" component="span">
                {t('withdrawal.label.total_withdrawal')}:{' '}
                <strong>
                  {totalWithdraw || 0} {toUpper(get('coin.id')(currentCoin))}
                </strong>
              </Typography>
            </Box>
          </Grid>
          {errorMessages && (
            <DisplayErrorMessagesComponent messages={errorMessages} />
          )}
          <AlertDialog
            fullWidth
            size="sm"
            okText={t('withdrawal.button.confirm')}
            onOk={() => {
              doWithdraw(
                recipientAddress,
                parseFloat(totalWithdraw),
                trackingId,
                get('coin.id')(currentCoin)
              );
              setDialogConfirm(false);
            }}
            isOpenDialog={dialogConfirm}
            setIsOpenDialog={setDialogConfirm}
            content={
              isEmpty(currentCoin) ? null : (
                <Grid container justify="center" alignItems="center">
                  <Typography variant="h5">
                    {t('withdrawal.label.confirm_msg')}
                  </Typography>
                  <ListItem>
                    <ListItemIcon className={classes.listItemIcon}>
                      <LabelImportant fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.importantText}
                      primary={
                        <Grid container direction="row">
                          <span>{t('withdrawal.coin')}:</span>
                          <div>&nbsp;&nbsp;</div>
                          <div>
                            <Grid container alignItems="center" direction="row">
                              <AvatarComponent
                                small
                                url={get('coin.logo')(currentCoin)}
                              />
                              <div>&nbsp;</div>
                              <Typography variant="button">
                                {get('coin.id')(currentCoin)}
                              </Typography>
                            </Grid>
                          </div>
                        </Grid>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className={classes.listItemIcon}>
                      <LabelImportant fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.importantText}
                      primary={
                        <div>
                          {t('withdrawal.total_amount_label')}:{' '}
                          <span style={{ color: '#3f51b5', fontWeight: '600' }}>
                            {totalWithdraw || 0}
                          </span>
                        </div>
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon className={classes.listItemIcon}>
                      <LabelImportant fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.importantText}
                      primary={
                        <div>
                          {t('withdrawal.address')}:{' '}
                          <span>{recipientAddress}</span>
                        </div>
                      }
                    />
                  </ListItem>
                </Grid>
              )
            }
          />
          <Grid container justify="flex-start">
            <Box>
              <Button
                disabled={isEmpty(currentCoin)}
                onClick={e => {
                  e.preventDefault();
                  if (parseFloat(withdrawAmount) && recipientAddress) {
                    setErrorAddress(false);
                    setErrorAmount(false);
                    setDialogConfirm(true);
                  } else {
                    !withdrawAmount || !parseFloat(withdrawAmount)
                      ? setErrorAmount(true)
                      : setErrorAmount(false);
                    !recipientAddress
                      ? setErrorAddress(true)
                      : setErrorAddress(false);
                  }
                }}
              >
                <Box py={1} px={4}>
                  {t('withdrawal.button.confirm_withdraw')}
                </Box>
              </Button>
              <Button
                variant="outlined"
                onClick={e => {
                  e.preventDefault();
                  setRecipientAddress('');
                  setWithdrawAmount('');
                  setTotalWithdraw('');
                }}
              >
                <Box py={1} px={4}>
                  {t('withdrawal.button.cancel')}
                </Box>
              </Button>
            </Box>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};
export default enhance(WithdrawalComponent);
