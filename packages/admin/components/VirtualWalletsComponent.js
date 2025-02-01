import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState, Fragment } from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  getQuickFilterEWalletsByCoinId,
  getQuickFilterEWalletsByCoinIdSelector,
  getQuickFilterEWalletsByCoinIdErrorSelector,
  SyncEWalletWithNetWorkDataSelector,
  SyncEWalletWithNetWorkErrorSelector,
  syncEWalletWithNetwork,
  SyncEWalletWithNetWorkResettor,
  ReNewDepositAddressDataSelector
} from '../stores/WalletState';
import {
  PaginationComponent,
  SearchComponent,
  EmptyWalletMessageComponent,
  DisplayErrorMessagesComponent,
  DisplayCoinLogoComponent
} from '@revtech/rev-shared/components';
import { getAllCoins, getAllCoinsSelector } from '../stores/PaymentState';
import { SelectField, Button, AlertDialog } from '@revtech/rev-shared/layouts';
import WalletDetailsCardForAdminComponent from './WalletDetailsCardForAdminComponent';
import { DEFAULT_DATE_RANGE } from '@revtech/rev-shared/utils';
import { Grid, makeStyles } from '@material-ui/core';
import { isEmpty } from 'lodash';
import { Sync, Refresh } from '@material-ui/icons';
import ReNewDepositAddressComponent from './ReNewDepositAddressComponent';

const COIN_DEFAULT = 'btc';

const connectToRedux = connect(
  createStructuredSelector({
    coinsData: getAllCoinsSelector,
    ewalletsData: getQuickFilterEWalletsByCoinIdSelector,
    ewalletsErrorMessage: getQuickFilterEWalletsByCoinIdErrorSelector,
    syncEWalletData: SyncEWalletWithNetWorkDataSelector,
    syncEWalletError: SyncEWalletWithNetWorkErrorSelector,
    reNewDepositAdrData: ReNewDepositAddressDataSelector
  }),
  (dispatch) => ({
    getEWalletsByCoinId: (
      page = 0,
      pageSize = 9,
      searchMessage = '',
      dateRange = DEFAULT_DATE_RANGE,
      coinId
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterEWalletsByCoinId({
            page,
            pageSize,
            filterContents: searchMessage.trim(),
            coinId,
            dateRange
          })
        );
    },
    getAllCoins: () => dispatch(getAllCoins()),
    syncEWallet: ({ arrayId = [], options = {} }) =>
      dispatch(syncEWalletWithNetwork({ arrayId, options })),
    resetSyncEWalletData: () => dispatch(SyncEWalletWithNetWorkResettor)
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation(['react-table', 'common'])
);

const useStyles = makeStyles((theme) => ({
  selectCoin: {
    margin: theme.spacing(1)
  },
  startIcon: {
    marginRight: theme.spacing(1)
  }
}));

const getCoinOptionsByCoinsData = (coinsData = []) =>
  coinsData.map((coin) => {
    return {
      value: coin.id,
      label: (
        <Grid container justify="flex-start" alignItems="center">
          <DisplayCoinLogoComponent coin={coin} small />
          <span style={{ marginLeft: 8, fontWeight: 'bold' }}>
            {coin.symbol}
          </span>
        </Grid>
      )
    };
  });

const getCoinById = ({ id, coinsData = [] }) =>
  coinsData.find((coin) => coin.id === id) || {};

const VirtualWalletsComponent = ({
  coinsData,
  getEWalletsByCoinId,
  ewalletsData,
  t,
  getAllCoins,
  ewalletsErrorMessage,
  resetSyncEWalletData,
  syncEWallet,
  syncEWalletData,
  syncEWalletError,
  reNewDepositAdrData
}) => {
  const classes = useStyles();
  const [currentCoin, setCurrentCoin] = useState(COIN_DEFAULT);
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);
  const [searchMessage, setSearchMessage] = useState('');
  const [arrayEWalletId, setArrayEWalletId] = useState([]);

  const [disableSyncButton, setDisableSyncButton] = useState(true);
  const [isSynchronizingMultiple, setIsSynchronizingMultiple] = useState(false);
  const [ewallets, setEwallet] = useState([]);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isOpenDepositAdr, setIsOpenDepositAdr] = useState(false);

  useEffect(() => {
    getAllCoins();
    getEWalletsByCoinId();
  }, [getAllCoins, getEWalletsByCoinId]);

  useEffect(() => {
    if (arrayEWalletId.length > 0) {
      setDisableSyncButton(false);
    } else {
      setDisableSyncButton(true);
    }
  }, [arrayEWalletId]);

  useEffect(() => {
    if (ewalletsData) {
      setEwallet(ewalletsData.ewallets);
      setTotalCount(ewalletsData.pageInfos.totalCount);
      setPage(ewalletsData.pageInfos.filter.page);
    }
  }, [ewalletsData]);

  useEffect(() => {
    if (!isEmpty(syncEWalletData)) {
      getEWalletsByCoinId(page, 9, searchMessage, dateRange, currentCoin);
    }

    if (!isEmpty(syncEWalletError) || !isEmpty(syncEWalletData)) {
      setIsSynchronizingMultiple(false);
      setArrayEWalletId([]);
      resetSyncEWalletData();
    }
  }, [
    syncEWalletError,
    syncEWalletData,
    resetSyncEWalletData,
    page,
    searchMessage,
    dateRange,
    currentCoin,
    getEWalletsByCoinId
  ]);

  useEffect(() => {
    setArrayEWalletId([]);
  }, [page]);

  useEffect(() => {
    if (reNewDepositAdrData === true) {
      setIsOpenDepositAdr(false);
    }
  }, [reNewDepositAdrData]);

  return (
    <Fragment>
      <AlertDialog
        title={t('common:ewallet.renew_deposit_adr.title')}
        onClose={() => setIsOpenDepositAdr(false)}
        fullWidth
        size="sm"
        isFooter={false}
        isOpenDialog={isOpenDepositAdr}
        setIsOpenDialog={setIsOpenDepositAdr}
        content={
          <Grid container justify="center" alignItems="center">
            {isOpenDepositAdr ? (
              <ReNewDepositAddressComponent coinsData={coinsData} />
            ) : null}
          </Grid>
        }
      />
      <Grid container justify="center">
        <Grid item xs={12}>
          <Grid container justify="center">
            <Grid item sm={12} md={6}>
              <SearchComponent
                placeholder={t('table.transaction_wallets.placeholder_search')}
                setSearchMessage={setSearchMessage}
                dispatchAction={getEWalletsByCoinId}
                setDateRange={setDateRange}
                dateRange={dateRange}
                searchMessage={searchMessage}
                externalParams={[currentCoin]}
                t={t}
                pagingInfo={{ page: 0, pageSize: 9 }}
                inputSearchProps={{
                  startAdornment: (
                    <Fragment>
                      <DisplayCoinLogoComponent
                        coin={getCoinById({ id: currentCoin, coinsData })}
                        small
                      />
                      <div>&nbsp;&nbsp;</div>
                    </Fragment>
                  )
                }}
                contentAdvance={
                  <SelectField
                    className={classes.selectCoin}
                    options={
                      coinsData ? getCoinOptionsByCoinsData(coinsData) : []
                    }
                    value={currentCoin}
                    placeholder={null}
                    onChange={(coinId) => {
                      setCurrentCoin(coinId);
                    }}
                  />
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: 24 }} justify="center">
          <Button
            disabled={disableSyncButton}
            startIcon={<Sync />}
            onClick={() => {
              syncEWallet({ arrayId: arrayEWalletId });
              setIsSynchronizingMultiple(true);
              setDisableSyncButton(true);
            }}
          >
            {t('common:ewallet.sync_multiple')}
          </Button>
          <Button
            startIcon={<Refresh />}
            onClick={() => {
              setIsOpenDepositAdr(true);
            }}
          >
            {t('common:ewallet.refresh_deposit_adr')}
          </Button>
        </Grid>
        {!isEmpty(ewalletsErrorMessage) ? (
          <Grid justify="center" container style={{ paddingTop: 40 }}>
            <DisplayErrorMessagesComponent messages={ewalletsErrorMessage} />
          </Grid>
        ) : ewallets.length ? (
          <Grid style={{ padding: '40px 0px' }} container justify="center">
            <Grid item md={12} lg={10}>
              <Grid container spacing={3}>
                {ewallets.map((item, index) => (
                  <Grid
                    key={index}
                    style={{ flexGrow: 1 }}
                    item
                    sm={6}
                    md={6}
                    lg={4}
                  >
                    <WalletDetailsCardForAdminComponent
                      setArrayEWalletId={setArrayEWalletId}
                      arrayEWalletsUpdating={arrayEWalletId}
                      ewallet={item}
                      isSynchronizingMultiple={isSynchronizingMultiple}
                      isDisableSyncButton={
                        isSynchronizingMultiple &&
                        arrayEWalletId.includes(item.id)
                      }
                      syncEWallet={syncEWallet}
                      syncEWalletData={syncEWalletData}
                      syncEWalletError={syncEWalletError}
                      resetSyncEWalletData={resetSyncEWalletData}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid style={{ margin: 24 }} container justify="center">
              <PaginationComponent
                size="large"
                actions={(page) =>
                  getEWalletsByCoinId(
                    page,
                    9,
                    searchMessage,
                    dateRange,
                    currentCoin
                  )
                }
                totalCount={totalCount}
                page={page}
              />
            </Grid>
          </Grid>
        ) : (
          <EmptyWalletMessageComponent>
            {t('table.transaction_wallets.message_empty_ewallet')}
          </EmptyWalletMessageComponent>
        )}
      </Grid>
    </Fragment>
  );
};
export default enhance(VirtualWalletsComponent);
