import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React, { useEffect } from 'react';
import {
  FormFields,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  updateCoinErrorMessageSelector,
  updateCoin,
  UpdateCoinAPIResetter,
  getCoinByIdSelector,
  getCoinById,
  updateCoinSuccessMessageSelector,
  GetCoinByIdAPIResetter
} from '../stores/CoinState';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { VALIDATIONS } from '@revtech/rev-shared/utils';
import { Grid, Typography } from '@material-ui/core';
import { withRouter } from 'next/router';

const {
  RenderFieldComponent,
  RenderImageFieldComponent,
  RenderSwitchFieldComponent
} = FormFields;
const { required, positiveNumberValidation } = VALIDATIONS;
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: updateCoinErrorMessageSelector,
    initialValues: getCoinByIdSelector,
    successMessages: updateCoinSuccessMessageSelector
  }),
  dispatch => ({
    onSubmit: values => {
      dispatch(updateCoin(values));
    },
    getCoinById: id => dispatch(getCoinById(id)),
    resetData: () => {
      dispatch(UpdateCoinAPIResetter);
      dispatch(GetCoinByIdAPIResetter);
    }
  })
);

const withForm = reduxForm({ form: 'editCoin', enableReinitialize: true });
const enhance = compose(
  connectToRedux,
  withTranslation('coin'),
  withForm,
  withRouter
);

const CoinEditComponent = ({
  handleSubmit,
  pristine,
  submitting,
  errorMessages,
  reset,
  t,
  getCoinById,
  resetData,
  router,
  successMessages
}) => {
  useEffect(() => {
    getCoinById(router.query.id);
    return () => {
      resetData();
    };
  }, [getCoinById, resetData, router.query.id, successMessages]);

  if (!router.query.id) {
    return null;
  }

  return (
    <Grid className="shadow">
      <CardSimpleLayout
        header={<Typography variant="h6">{t('update_coin')}</Typography>}
        body={
          <form onSubmit={handleSubmit}>
            <Grid container direction="row">
              <Field
                name="id"
                component={RenderFieldComponent}
                col={4}
                label={t('add_new.id')}
                placeholder={t('add_new.id_placeholder')}
                validate={[required]}
              />
              <Field
                name="name"
                component={RenderFieldComponent}
                placeholder={t('add_new.name_placeholder')}
                label={t('add_new.name')}
                col={4}
                validate={[required]}
              />
              <Field
                name="symbol"
                component={RenderFieldComponent}
                placeholder={t('add_new.symbol_placeholder')}
                label={t('add_new.symbol')}
                col={4}
                validate={[required]}
              />
              <Field
                type="number"
                name="minimumWithdrawal"
                component={RenderFieldComponent}
                placeholder={t('add_new.minimum_withdrawal')}
                label={t('add_new.minimum_withdrawal')}
                col={4}
                validate={[positiveNumberValidation]}
              />
              <Field
                type="number"
                name="minimumDeposit"
                component={RenderFieldComponent}
                placeholder={t('add_new.minimum_deposit')}
                label={t('add_new.minimum_deposit')}
                col={4}
                validate={[positiveNumberValidation]}
              />
              <Field
                type="number"
                name="feePercentage"
                component={RenderFieldComponent}
                placeholder={t('add_new.percentage')}
                label={t('add_new.percentage')}
                col={4}
                validate={[positiveNumberValidation]}
              />
              <Field
                type="number"
                name="feeFixed"
                component={RenderFieldComponent}
                placeholder={t('add_new.fee_fixed')}
                label={t('add_new.fee_fixed')}
                col={4}
                validate={[positiveNumberValidation]}
              />
              <Field
                name="isCompoundSupport"
                component={RenderSwitchFieldComponent}
                placeholder={t('add_new.compound_support')}
                label={t('add_new.compound_support')}
                col={4}
              />
              <Field
                type="number"
                name="decimals"
                component={RenderFieldComponent}
                placeholder={t('add_new.decimals')}
                label={t('add_new.decimals')}
                col={4}
                validate={[positiveNumberValidation]}
              />
              <Field
                type="number"
                name="marginPercentage"
                component={RenderFieldComponent}
                placeholder={t('add_new.margin_percentage')}
                label={t('add_new.margin_percentage')}
                col={4}
                validate={[positiveNumberValidation]}
              />
              <Field
                name="isPFSupport"
                component={RenderSwitchFieldComponent}
                placeholder={t('add_new.support_PF')}
                label={t('add_new.support_PF')}
                col={4}
              />
              <Field
                name="contractAddress"
                component={RenderFieldComponent}
                placeholder={t('add_new.contract_address')}
                label={t('add_new.contract_address')}
                col={4}
              />
            </Grid>

            <Field
              name="logo"
              component={props => <RenderImageFieldComponent icon {...props} />}
            />
            <Grid container justify="center">
              <Grid>
                <Button type="submit" disabled={pristine || submitting}>
                  {t('button.update')}
                </Button>
                <Button
                  color="secondary"
                  disabled={pristine || submitting}
                  onClick={reset}
                >
                  {t('add_new.reset_button')}
                </Button>
              </Grid>
            </Grid>
            <DisplayErrorMessagesComponent messages={errorMessages} />
          </form>
        }
      />
    </Grid>
  );
};

export default enhance(CoinEditComponent);
