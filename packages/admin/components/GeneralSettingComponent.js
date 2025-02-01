import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { currentUserSelector } from '../stores/UserState';
import {
  updateGeneralSetting,
  updateGeneralSettingErrorMessageSelector,
  updateGeneralSettingSuccessSelector,
  getGeneralSettingDataSelector,
  getGeneralSetting,
  resetGeneralSettings
} from '../stores/AdminState';

import {
  CopyTextComponent,
  FormFields,
  SuccessComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { VALIDATIONS } from '@revtech/rev-shared/utils';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid } from '@material-ui/core';

const { required, numberValidation, positiveNumberValidation } = VALIDATIONS;
const { RenderFieldComponent, RenderSwitchFieldComponent } = FormFields;

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector,
    success: updateGeneralSettingSuccessSelector,
    errorMessages: updateGeneralSettingErrorMessageSelector,
    initialValues: getGeneralSettingDataSelector
  }),
  dispatch => ({
    GetGeneralSetting: () => {
      dispatch(getGeneralSetting());
    },
    onSubmit: values => {
      values.transferLimit = parseFloat(values.transferLimit);
      dispatch(updateGeneralSetting(values));
    },
    resetData: () => {
      resetGeneralSettings(dispatch);
    }
  })
);

const withForm = reduxForm({
  form: 'partnerGeneralSetting',
  enableReinitialize: true
});
const enhance = compose(
  connectToRedux,
  withForm,
  withTranslation(['settings', 'common'])
);

class GeneralSettingComponent extends React.Component {
  componentDidMount() {
    this.props.GetGeneralSetting();
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const {
      initialValues,
      handleSubmit,
      pristine,
      submitting,
      success,
      errorMessages,
      t
    } = this.props;
    return (
      <Grid className="shadow">
        <CardSimpleLayout
          header={t('general_setting.title')}
          body={
            <form style={{ marginTop: 8 }} onSubmit={handleSubmit}>
              <Field
                name="homePageTitle"
                component={RenderFieldComponent}
                col={12}
                label={t('general_setting.label.homepage_title')}
              />
              <Field
                name="homePageDescription"
                component={RenderFieldComponent}
                col={12}
                label={t('general_setting.label.homepage_desc')}
              />
              <Grid container alignItems="center">
                <Field
                  type="number"
                  name="transferLimit"
                  component={RenderFieldComponent}
                  col={4}
                  label={t('general_setting.label.limit_transfer')}
                  validate={[
                    required,
                    numberValidation,
                    positiveNumberValidation
                  ]}
                />
                <Grid item sm={8} xs={12}>
                  <CopyTextComponent
                    label={t('general_setting.label.master_wallet')}
                    text={(initialValues || {}).masterWallet}
                  />
                </Grid>
              </Grid>
              <Grid container justify="center" alignItems="center">
                <Field
                  col={4}
                  name="serverStatus"
                  component={RenderSwitchFieldComponent}
                />
                <Field
                  name="maintenanceMessage"
                  component={RenderFieldComponent}
                  col={8}
                  label={t('general_setting.label.maintenance_message')}
                />
              </Grid>

              <Grid container justify="center">
                <Button type="submit" disabled={pristine || submitting}>
                  {t('general_setting.button.save')}
                </Button>
              </Grid>
              {success && <SuccessComponent title={t('common:save_success')} />}
              <DisplayErrorMessagesComponent messages={errorMessages} />
            </form>
          }
        />
      </Grid>
    );
  }
}

export default enhance(GeneralSettingComponent);
