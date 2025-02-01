import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';

import {
  getAccountSetting,
  updateAccountSetting
} from '@revtech/rev-shared/apis/actions';
import {
  getAccountSettingDataSelector,
  updateAccountSettingErrorMessageSelector,
  updateAccountSettingSuccessMessageSelector
} from '@revtech/rev-shared/apis/selectors';
import {
  getAccountSettingAPIResetter,
  updateAccountSettingAPIResetter
} from '@revtech/rev-shared/apis/resetters';

import {
  FormFields,
  SuccessComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { VALIDATIONS, OPTIONS } from '@revtech/rev-shared/utils';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid } from '@material-ui/core';

const { languageOptions } = OPTIONS;
const { required } = VALIDATIONS;
const { RenderTimezoneFieldComponent, RenderSelectFieldComponent } = FormFields;

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

const enhance = compose(connectToRedux, withForm, withTranslation('settings'));

class AccountSettingComponent extends React.Component {
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
            <form
              style={{ marginTop: 8, marginBottom: 32 }}
              onSubmit={handleSubmit}
            >
              <Field
                label={t('account_setting.label.language')}
                name="language"
                component={RenderSelectFieldComponent}
                options={languageOptions}
                className="form-control"
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
export default enhance(AccountSettingComponent);
