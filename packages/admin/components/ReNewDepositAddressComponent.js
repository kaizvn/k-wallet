import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect, useState } from 'react';
import {
  FormFields,
  DisplayErrorMessagesComponent,
  DisplayCoinLogoComponent
} from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { VALIDATIONS } from '@revtech/rev-shared/utils';
import { Grid, Collapse, Typography } from '@material-ui/core';
import {
  reNewDepositAddress,
  ReNewDepositAddressErrorSelector,
  ReNewDepositAddressResettor
} from '../stores/WalletState';
const {
  RenderFieldComponent,
  RenderSelectFieldComponent,
  RenderSwitchFieldComponent
} = FormFields;
const { required } = VALIDATIONS;

const connectToRedux = connect(
  createStructuredSelector({
    reNewErrorMsg: ReNewDepositAddressErrorSelector
  }),
  dispatch => ({
    onSubmit: values => dispatch(reNewDepositAddress(values)),
    resetData: () => dispatch(ReNewDepositAddressResettor)
  })
);

const withForm = reduxForm({ form: 'reNewDepositAddress' });
const enhance = compose(connectToRedux, withTranslation('common'), withForm);

const getCoinOptionsByCoinsData = (coinsData = []) =>
  coinsData.map(coin => {
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

const ReNewDepositAddressComponent = ({
  handleSubmit,
  pristine,
  submitting,
  reNewErrorMsg,
  reset,
  t,
  coinsData = [],
  resetData
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isRequiredTracking, setIsRequiredTracking] = useState(false);
  useEffect(() => {
    return () => {
      resetData();
    };
  }, [resetData]);

  useEffect(() => {
    if (expanded) {
      setIsRequiredTracking(false);
    } else {
      setIsRequiredTracking(true);
    }
  }, [expanded]);

  const getIsRequiredTracking = values => {
    return isRequiredTracking ? required(values) : null;
  };

  return (
    <Grid>
      <CardSimpleLayout
        body={
          <form onSubmit={handleSubmit}>
            <Grid container direction="row">
              <Field
                name="username"
                component={RenderFieldComponent}
                col={12}
                label={t('ewallet.renew_deposit_adr.username')}
                validate={[required]}
              />
              <Field
                name="trackingId"
                component={RenderFieldComponent}
                label={t('ewallet.renew_deposit_adr.tracking_id')}
                col={12}
                validate={[getIsRequiredTracking]}
              />
              <Field
                name="coinId"
                component={RenderSelectFieldComponent}
                label={t('ewallet.renew_deposit_adr.coin_id')}
                col={12}
                options={getCoinOptionsByCoinsData(coinsData)}
                validate={[required]}
              />
              <Field
                onChange={(event, newValue) => {
                  if (newValue === true) {
                    setExpanded(true);
                  } else {
                    setExpanded(false);
                  }
                }}
                name="emptyDepositAddresses"
                component={RenderSwitchFieldComponent}
                label={t('ewallet.renew_deposit_adr.empty_deposit')}
                col={12}
              />
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <div
                  style={{ fontStyle: 'italic', margin: '0px 16px 8px 16px' }}
                >
                  <Typography color="secondary" variant="button">
                    {t('ewallet.renew_deposit_adr.warning')}
                  </Typography>
                </div>
              </Collapse>
            </Grid>
            <Grid container justify="center">
              <Grid>
                <Button type="submit" disabled={pristine || submitting}>
                  {t('ewallet.renew_deposit_adr.submit')}
                </Button>
                <Button
                  color="secondary"
                  type="button"
                  disabled={pristine || submitting}
                  onClick={reset}
                >
                  {t('ewallet.renew_deposit_adr.reset')}
                </Button>
              </Grid>
            </Grid>
            <DisplayErrorMessagesComponent messages={reNewErrorMsg} />
          </form>
        }
      />
    </Grid>
  );
};

export default enhance(ReNewDepositAddressComponent);
