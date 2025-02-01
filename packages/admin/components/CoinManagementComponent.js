import { APP_ACTIONS, STATUS, ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import {
  AvatarComponent,
  FrameHeaderComponent,
  CoinStatusComponent,
  DisplayErrorMessagesComponent,
  ButtonActionTableComponent
} from '@revtech/rev-shared/components';
import { Button, ReactTableLayout, RLink } from '@revtech/rev-shared/layouts';
import {
  DATE_TIME_FORMAT,
  InformationComponent,
  DEFAULT_DATE_RANGE
} from '@revtech/rev-shared/utils';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createLink } from '@revtech/rev-shared/libs';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Link from 'next/link';
import Moment from 'react-moment';
import React, { Fragment } from 'react';

import {
  getQuickFilterCoinList,
  GetQuickFilterCoinListSelector,
  GetQuickFilterCoinListErrorSelector,
  updateCoinStatus
} from '../stores/CoinState';
import { currentUserSelector } from '../stores/UserState';
import { Lock, LockOpen, Edit, Check, Cancel } from '@material-ui/icons';
import { useState } from 'react';

const { ROLE_ADMIN } = ACCOUNT_ROLES;
const { COIN_ACTIVE } = STATUS;
const { COIN_DISABLE, COIN_ENABLE } = APP_ACTIONS;

const connectToRedux = connect(
  createStructuredSelector({
    coinsFiltered: GetQuickFilterCoinListSelector,
    errorMessages: GetQuickFilterCoinListErrorSelector,
    currentUserData: currentUserSelector
  }),
  dispatch => ({
    getCoinList: (
      page,
      pageSize,
      filterText = '',
      dateRange = DEFAULT_DATE_RANGE
    ) => {
      const { fromDate, toDate } = dateRange;
      typeof fromDate === typeof toDate &&
        dispatch(
          getQuickFilterCoinList({
            page,
            pageSize,
            filterContents: filterText.trim(),
            dateRange
          })
        );
    },
    updateCoinStatus: ({ id, action }) =>
      dispatch(updateCoinStatus({ id, action }))
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation(['react-table', 'common', 'coin'])
);

const getButtonActions = (coin, { updateCoinStatus, t }) => {
  const isActive = coin.status === COIN_ACTIVE;
  const action = isActive ? COIN_DISABLE : COIN_ENABLE;
  return (
    <Fragment>
      <ButtonActionTableComponent
        label={t(`coin:button.${isActive ? 'disable_coin' : 'enable_coin'}`)}
        action={() => updateCoinStatus({ id: coin.id, action })}
        icon={isActive ? <Lock /> : <LockOpen />}
      />
      <RLink href={createLink(['coins', `edit?id=${coin.id}`])}>
        <ButtonActionTableComponent
          label={t('coin:button.edit')}
          icon={<Edit />}
        />
      </RLink>
    </Fragment>
  );
};

const mapCoinsToDataField = ({ coins = [], t, updateCoinStatus }) =>
  coins.map(coin => ({
    id: (
      <Link href={createLink(['coins', `details?id=${coin.id}`])}>
        <a>
          <InformationComponent>{coin.id} </InformationComponent>
        </a>
      </Link>
    ),
    name: coin.name,
    symbol: coin.symbol,
    logo: <AvatarComponent small url={coin.logo} icon />,
    feePercentage: coin.feePercentage + ' %',
    feeFixed: `${coin.feeFixed} ${coin.id}`,
    isPFSupport: coin.isPFSupport ? (
      <Check color="primary" />
    ) : (
      <Cancel color="secondary" />
    ),
    isCompoundSupport: coin.isCompoundSupport ? (
      <Check color="primary" />
    ) : (
      <Cancel color="secondary" />
    ),
    dateCreate: <Moment format={DATE_TIME_FORMAT}>{coin.createdAt}</Moment>,
    status: <CoinStatusComponent t={t} status={coin.status} />,
    actions: getButtonActions(coin, {
      t,
      updateCoinStatus
    })
  }));

const CoinManagementComponent = ({
  getCoinList,
  coinsFiltered,
  t,
  updateCoinStatus,
  currentUserData,
  errorMessages
}) => {
  const [searchMessage, setSearchMessage] = useState('');
  const [dateRange, setDateRange] = useState(DEFAULT_DATE_RANGE);

  const isAdmin = currentUserData.systemUserRole === ROLE_ADMIN;
  let renderCoins = [];
  let totalCount = 0,
    page = 0,
    pageSize = 10;
  if (coinsFiltered) {
    renderCoins = coinsFiltered.coins;
    totalCount = coinsFiltered.pageInfos.totalCount;
    page = coinsFiltered.pageInfos.filter.page;
    pageSize = coinsFiltered.pageInfos.filter.pageSize;
  }
  const COLUMNS = [
    {
      field: 'id',
      title: t('table.coins_manage.header.id')
    },
    {
      field: 'name',
      title: t('table.coins_manage.header.name')
    },
    {
      field: 'symbol',
      title: t('table.coins_manage.header.symbol')
    },
    {
      field: 'logo',
      title: t('table.coins_manage.header.logo')
    },
    {
      field: 'dateCreate',
      title: t('table.coins_manage.header.date_create')
    },
    {
      field: 'feePercentage',
      title: t('table.coins_manage.header.fee_percentage')
    },
    {
      field: 'feeFixed',
      title: t('table.coins_manage.header.fee_fixed')
    },
    {
      field: 'isPFSupport',
      title: t('table.coins_manage.header.support_PF')
    },
    {
      field: 'isCompoundSupport',
      title: t('table.coins_manage.header.support_compound')
    },
    {
      field: 'status',
      title: t('table.coins_manage.header.status')
    }
  ];
  if (isAdmin) {
    COLUMNS.push({
      field: 'actions',
      title: t('table.coins_manage.header.actions')
    });
  }
  return (
    <React.Fragment>
      <DisplayErrorMessagesComponent messages={errorMessages} />
      <FrameHeaderComponent title={t('table.coins_manage.title')}>
        {isAdmin ? (
          <RLink href="/coins/add">
            <Button>{t('table.coins_manage.add_new_coin')}</Button>
          </RLink>
        ) : null}
      </FrameHeaderComponent>
      <ReactTableLayout
        searchProps={{
          placeholder: t('table.coins_manage.placeholder_search'),
          searchMessage,
          setSearchMessage
        }}
        dateRangeProps={{
          dateRange,
          setDateRange
        }}
        data={mapCoinsToDataField({
          coins: renderCoins,
          updateCoinStatus,
          t
        })}
        columns={COLUMNS}
        dispatchAction={getCoinList}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        t={t}
      />
    </React.Fragment>
  );
};

export default enhance(CoinManagementComponent);
