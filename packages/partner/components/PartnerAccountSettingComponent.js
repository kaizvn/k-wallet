import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';

import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  getAccountSetting,
  updateAccountSetting
} from '@revtech/rev-shared/apis/actions';
import {
  updateAccountSettingErrorMessageSelector,
  updateAccountSettingSuccessMessageSelector,
  getAccountSettingDataSelector
} from '@revtech/rev-shared/apis/selectors';
import {
  getAccountSettingAPIResetter,
  updateAccountSettingAPIResetter
} from '@revtech/rev-shared/apis/resetters';

import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import {
  FormFields,
  SuccessComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import { Grid } from '@material-ui/core';

const { required } = VALIDATIONS;
const { languageOptions } = OPTIONS;
const { RenderSelectFieldComponent, RenderTimezoneFieldComponent } = FormFields;

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: updateAccountSettingErrorMessageSelector,
    success: updateAccountSettingSuccessMessageSelector,
    initialValues: getAccountSettingDataSelector
  }),
  dispatch => ({
    getUserSetting: () => {
      dispatch(getAccountSetting());
    },
    onSubmit: values => {
      dispatch(updateAccountSetting(values));
    },
    resetData: () => {
      dispatch(getAccountSettingAPIResetter);
      dispatch(updateAccountSettingAPIResetter);
    }
  })
);

const withForm = reduxForm({
  form: 'userSetting',
  enableReinitialize: true
});

const enhance = compose(connectToRedux, withForm, withTranslation('setting'));

class PartnerAccountSettingComponent extends React.Component {
  componentWillUnmount() {
    this.props.resetData();
  }

  componentDidMount() {
    this.props.getUserSetting();
  }

  render() {
    const {
      submitting,
      pristine,
      success,
      errorMessages,
      handleSubmit,
      t
    } = this.props;

    return (
      <Grid className="shadow">
        <CardSimpleLayout
          header={t('account_setting.title')}
          body={
            <form onSubmit={handleSubmit}>
              <label> {t('account_setting.label.language')} </label>
              <Field
                name="language"
                component={RenderSelectFieldComponent}
                options={languageOptions}
                validate={[required]}
              />
              <Field
                name="timezone"
                component={RenderTimezoneFieldComponent}
                validate={[required]}
              />
              <Grid container justify="center" style={{ margin: '16px 0px' }}>
                <Button type="submit" disabled={pristine || submitting}>
                  {t('account_setting.button.save')}
                </Button>
              </Grid>
              {success && (
                <SuccessComponent
                  title={t('account_setting.message.save_success')}
                />
              )}
              <DisplayErrorMessagesComponent messages={errorMessages} />
            </form>
          }
        />
      </Grid>
    );
  }
}
export default enhance(PartnerAccountSettingComponent);
