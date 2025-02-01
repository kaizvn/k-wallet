import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { Field, reduxForm } from 'redux-form';
import {
  FormFields,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { VALIDATIONS } from '@revtech/rev-shared/utils';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  updatePartnerGeneralSetting,
  updatePartnerGeneralSettingErrorMessageSelector,
  updatePartnerGeneralSettingSuccessSelector,
  getPartnerGeneralSettingDataSelector,
  getPartnerGeneralSetting,
  resetPartnerSettings
} from '../stores/PartnerState';
import { Grid } from '@material-ui/core';

const {
  required,
  isUrl,
  numberValidation,
  positiveNumberValidation
} = VALIDATIONS;

const {
  RenderFieldComponent,
  RenderTimezoneFieldComponent,
  RenderSwitchFieldComponent
} = FormFields;

const connectToRedux = connect(
  createStructuredSelector({
    success: updatePartnerGeneralSettingSuccessSelector,
    errorMessage: updatePartnerGeneralSettingErrorMessageSelector,
    initialValues: getPartnerGeneralSettingDataSelector
  }),
  dispatch => ({
    GetPartnerGeneralSetting: () => {
      dispatch(getPartnerGeneralSetting());
    },
    onSubmit: values => {
      values.transferLimit = parseFloat(values.transferLimit);
      dispatch(updatePartnerGeneralSetting(values));
    },
    resetData: () => {
      resetPartnerSettings(dispatch);
    }
  })
);

const withForm = reduxForm({
  form: 'partnerGeneralSetting',
  enableReinitialize: true
});
const enhance = compose(connectToRedux, withForm, withTranslation('setting'));

class PartnerGeneralSettingComponent extends React.Component {
  componentDidMount() {
    this.props.GetPartnerGeneralSetting();
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const { handleSubmit, pristine, submitting, errorMessage, t } = this.props;
    return (
      <Grid className="shadow">
        <CardSimpleLayout
          header={t('partner_setting.title')}
          body={
            <form style={{ marginTop: 8 }} onSubmit={handleSubmit}>
              <Field
                name="callbackUrl"
                component={RenderFieldComponent}
                col={12}
                label={t('partner_setting.label.callback_url')}
                validate={[isUrl]}
              />
              <Field
                name="timezone"
                component={RenderTimezoneFieldComponent}
                validate={[required]}
              />
              <Grid container alignItems="center">
                <Field
                  name="partnerName"
                  component={RenderFieldComponent}
                  col={6}
                  label={t('partner_setting.label.partner_name')}
                  validate={[required]}
                />
                <Field
                  name="partnerDescription"
                  component={RenderFieldComponent}
                  col={6}
                  label={t('partner_setting.label.partner_desc')}
                />
              </Grid>
              <Grid container alignItems="center">
                <Field
                  label={t('partner_setting.label.service_status')}
                  name="serviceStatus"
                  component={RenderSwitchFieldComponent}
                />
                <Field
                  name="transferLimit"
                  component={RenderFieldComponent}
                  col={8}
                  label={t('partner_setting.label.limit_transfer')}
                  validate={[numberValidation, positiveNumberValidation]}
                />
              </Grid>
              <Grid container justify="center">
                <Button type="submit" disabled={pristine || submitting}>
                  {t('partner_setting.button.save')}
                </Button>
              </Grid>
              <DisplayErrorMessagesComponent messages={errorMessage} />
            </form>
          }
        />
      </Grid>
    );
  }
}

export default enhance(PartnerGeneralSettingComponent);
