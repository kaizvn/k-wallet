import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import {
  FormFields,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  addNewCoinErrorMessageSelector,
  addNewCoin,
  AddNewCoinAPIResetter
} from '../stores/CoinState';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { VALIDATIONS } from '@revtech/rev-shared/utils';
import { Grid, Typography } from '@material-ui/core';
const {
  RenderFieldComponent,
  RenderImageFieldComponent,
  RenderSwitchFieldComponent
} = FormFields;
const { required, positiveNumberValidation } = VALIDATIONS;
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: addNewCoinErrorMessageSelector
  }),
  dispatch => ({
    onSubmit: values => {
      dispatch(addNewCoin(values));
    },
    resetData: () => dispatch(AddNewCoinAPIResetter)
  })
);

const withForm = reduxForm({ form: 'addCoin' });
const enhance = compose(connectToRedux, withTranslation('coin'), withForm);

class UserAddingComponent extends React.Component {
  componentWillUnmount() {
    this.props.resetData();
  }
  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      errorMessages,
      reset,
      t
    } = this.props;
    return (
      <Grid className="shadow">
        <CardSimpleLayout
          header={<Typography variant="h5">{t('add_new.title')}</Typography>}
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
                  name="network"
                  component={RenderFieldComponent}
                  placeholder={t('add_new.network')}
                  label={t('add_new.network')}
                  col={4}
                  validate={[required]}
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
                component={props => (
                  <RenderImageFieldComponent icon {...props} />
                )}
              />
              <Grid container justify="center">
                <Grid>
                  <Button type="submit" disabled={pristine || submitting}>
                    {t('add_new.add_button')}
                  </Button>
                  <Button
                    color="secondary"
                    type="button"
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
  }
}

export default enhance(UserAddingComponent);
