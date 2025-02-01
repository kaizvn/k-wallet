import {
  Button,
  InfoLayout,
  CardSimpleLayout,
  RLink
} from '@revtech/rev-shared/layouts';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import {
  CoinStatusComponent,
  AvatarComponent,
  MissingInfoComponent,
  ShortenContentComponent
} from '@revtech/rev-shared/components';
import { STATUS, APP_ACTIONS, ACCOUNT_ROLES } from '@revtech/rev-shared/enums';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';
import { upperCase } from 'lodash/fp';

import {
  getCoinByIdSelector,
  getCoinById,
  updateCoinStatus
} from '../stores/CoinState';
import { currentUserSelector } from '../stores/UserState';
import { Grid, Typography } from '@material-ui/core';
import { Edit, Check, Cancel } from '@material-ui/icons';

const { ROLE_ADMIN } = ACCOUNT_ROLES;
const { COIN_ACTIVE, COIN_INACTIVE } = STATUS;
const { COIN_DISABLE, COIN_ENABLE } = APP_ACTIONS;

const connectToRedux = connect(
  createStructuredSelector({
    coin: getCoinByIdSelector,
    currentUserData: currentUserSelector
  }),
  dispatch => ({
    getCoinDetails: id => dispatch(getCoinById(id)),
    updateCoinStatus: ({ id, action }) =>
      dispatch(updateCoinStatus({ id, action }))
  })
);

const enhance = compose(connectToRedux, withTranslation(['coin', 'common']));

class CoinDetailsComponent extends React.Component {
  componentDidMount() {
    this.props.getCoinDetails(Router.query.id);
  }
  render() {
    const { coin, t, updateCoinStatus, currentUserData } = this.props;
    const rows = [
      { label: t('detail.coin_details.label.id'), key: 'id' },
      { label: t('detail.coin_details.label.name'), key: 'name' },
      { label: t('detail.coin_details.label.symbol'), key: 'symbol' },
      { label: t('detail.coin_details.label.logo'), key: 'logo' },
      {
        label: t('detail.coin_details.label.minimum_withdrawal'),
        key: 'minimumWithdrawal'
      },
      {
        label: t('detail.coin_details.label.minimum_deposit'),
        key: 'minimumDeposit'
      },
      {
        label: t('detail.coin_details.label.percentage'),
        key: 'feePercentage'
      },
      {
        label: t('detail.coin_details.label.fee_fixed'),
        key: 'feeFixed'
      },
      { label: t('detail.coin_details.label.decimals'), key: 'decimals' },
      { label: t('detail.coin_details.label.network'), key: 'network' },
      {
        label: t('detail.coin_details.label.contract_address'),
        key: 'contractAddress'
      },
      { label: t('detail.coin_details.label.support_PF'), key: 'isPFSupport' },
      {
        label: t('detail.coin_details.label.compound_support'),
        key: 'isCompoundSupport'
      },
      { label: t('detail.coin_details.label.date_create'), key: 'date_create' },
      { label: t('detail.coin_details.label.status'), key: 'status' }
    ];
    let displays = {};
    if (coin)
      displays = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        logo: <AvatarComponent small url={coin.logo} icon />,
        date_create: (
          <Moment format={DATE_TIME_FORMAT}>{coin.createdAt}</Moment>
        ),
        decimals: coin.decimals,
        network: coin.network,
        feePercentage: coin.feePercentage + ' %',
        feeFixed: `${coin.feeFixed} ${coin.id}`,
        minimumWithdrawal: coin.minimumWithdrawal,
        minimumDeposit: coin.minimumDeposit,
        contractAddress: (
          <ShortenContentComponent value={coin.contractAddress} />
        ),
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
        status: <CoinStatusComponent t={t} status={coin.status} />
      };

    return !coin ? (
      <MissingInfoComponent>
        <Typography variant="h5" color="secondary">
          {t('common:rev_shared.message.not_found_coin')}
        </Typography>
      </MissingInfoComponent>
    ) : (
      <Grid>
        <Grid container justify="center">
          <Grid xs={12} item className="shadow-0">
            <CardSimpleLayout
              header={
                <Grid container justify="space-between" alignItems="center">
                  <Typography variant="h6">
                    {t('detail.coin_details.title')}
                  </Typography>
                  {currentUserData.systemUserRole === ROLE_ADMIN && (
                    <Grid>
                      <RLink href={`/coins/edit?id=${coin.id}`}>
                        <Button variant="outlined" startIcon={<Edit />}>
                          {upperCase(t('button.edit'))}
                        </Button>
                      </RLink>
                      {coin.status === COIN_ACTIVE && (
                        <Button
                          color="secondary"
                          onClick={() =>
                            updateCoinStatus({
                              id: coin.id,
                              action: COIN_DISABLE
                            })
                          }
                        >
                          {upperCase(t('button.disable_coin'))}
                        </Button>
                      )}
                      {coin.status === COIN_INACTIVE && (
                        <Button
                          onClick={() =>
                            updateCoinStatus({
                              id: coin.id,
                              action: COIN_ENABLE
                            })
                          }
                        >
                          {upperCase(t('button.enable_coin'))}
                        </Button>
                      )}
                    </Grid>
                  )}
                </Grid>
              }
              body={
                <InfoLayout
                  title="Profile Info"
                  subtitle=""
                  rows={rows}
                  displays={displays}
                />
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default enhance(CoinDetailsComponent);
