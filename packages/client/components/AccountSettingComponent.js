import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Router from 'next/router';
import { getbackUrl } from '@revtech/rev-shared/libs';
import { compose } from 'recompose';
import { Button, CardSimpleLayout, RLink } from '@revtech/rev-shared/layouts';
import {
  FormFields,
  SuccessComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import { withTranslation } from '@revtech/rev-shared/i18n';
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
import { Grid } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

const { RenderSelectFieldComponent, RenderTimezoneFieldComponent } = FormFields;
const { languageOptions } = OPTIONS;
const { required } = VALIDATIONS;

const connectToRedux = connect(
  createStructuredSelector({
    errorMessage: updateAccountSettingErrorMessageSelector,
    success: updateAccountSettingSuccessMessageSelector,
    initialValues: getAccountSettingDataSelector
  }),
  (dispatch) => ({
    getAccountSetting: () => {
      dispatch(getAccountSetting());
    },
    onSubmit: (values) => {
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

const enhance = compose(connectToRedux, withForm, withTranslation('user'));

class AccountSettingComponent extends React.Component {
  componentDidMount() {
    this.props.getAccountSetting();
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const {
      submitting,
      pristine,
      success,
      errorMessage,
      handleSubmit,
      t
    } = this.props;
    return (
      <Grid container>
        <Grid style={{ padding: '0px 0px 24px 24px' }} container>
          <RLink href={getbackUrl(Router.router.pathname, '')}>
            <Button startIcon={<ArrowBackIos />}>
              {t('setting.button.back')}
            </Button>
          </RLink>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={10} sm={10} md={8} lg={6} className="shadow">
            <CardSimpleLayout
              header={t('setting.title')}
              body={
                <form onSubmit={handleSubmit}>
                  <label> {t('setting.label.language')} </label>
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
                  <Grid
                    container
                    justify="center"
                    style={{ margin: '16px 0px' }}
                  >
                    <Button type="submit" disabled={pristine || submitting}>
                      {t('setting.button.save')}
                    </Button>
                  </Grid>
                  {success && (
                    <SuccessComponent
                      title={t('setting.message.save_success')}
                    />
                  )}
                  <DisplayErrorMessagesComponent messages={errorMessage} />
                </form>
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default enhance(AccountSettingComponent);
