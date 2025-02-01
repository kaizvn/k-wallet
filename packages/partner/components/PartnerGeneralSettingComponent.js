import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';

import { currentPartnerSelector } from '../stores/UserState';
import {
  updatePartnerGeneralSetting,
  updatePartnerGeneralSettingErrorMessageSelector,
  updatePartnerGeneralSettingSuccessSelector,
  getPartnerGeneralSettingDataSelector,
  getPartnerGeneralSetting,
  resetGetPartnerGeneralSetting,
  resetUpdatePartnerGeneralSetting
} from '../stores/PartnerState';

import { VALIDATIONS } from '@revtech/rev-shared/utils';

import { Button } from '@revtech/rev-shared/layouts';
import {
  FrameComponent,
  FrameHeaderComponent,
  SuccessComponent,
  DisplayErrorMessagesComponent,
  FormFields
} from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';

const { RenderFieldComponent, RenderTimezoneFieldComponent } = FormFields;
const { required, isUrl } = VALIDATIONS;
const connectToRedux = connect(
  createStructuredSelector({
    currentPartner: currentPartnerSelector,
    success: updatePartnerGeneralSettingSuccessSelector,
    error: updatePartnerGeneralSettingErrorMessageSelector,
    initialValues: getPartnerGeneralSettingDataSelector
  }),
  dispatch => ({
    GetPartnerGeneralSetting: id => {
      resetGetPartnerGeneralSetting(dispatch);
      dispatch(getPartnerGeneralSetting(id));
    },
    onSubmit: values => {
      dispatch(updatePartnerGeneralSetting(values));
      resetUpdatePartnerGeneralSetting(dispatch);
    },
    resetData: () => {
      resetUpdatePartnerGeneralSetting(dispatch);
      resetGetPartnerGeneralSetting(dispatch);
    }
  })
);

const withForm = reduxForm({
  form: 'partnerGeneralSetting',
  enableReinitialize: true
});
const enhance = compose(connectToRedux, withForm, withTranslation('setting'));

class PartnerGeneralSetting extends React.Component {
  componentWillMount() {
    this.props.GetPartnerGeneralSetting(this.props.currentPartner.id);
  }

  componentWillUnmount() {
    this.props.resetData();
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      success,
      error,
      reset,
      t
    } = this.props;
    return (
      <FrameComponent>
        <FrameHeaderComponent title={t('general.title')} />
        <div className="card-block">
          <form className="mt-4" onSubmit={handleSubmit}>
            <div className="form-group row">
              <Field
                className="form-control"
                name="callbackUrl"
                component={RenderFieldComponent}
                col="8"
                label={t('general.label.callback_url')}
                validate={[isUrl]}
              />
            </div>

            <Field
              className="form-control"
              name="timezone"
              component={RenderTimezoneFieldComponent}
              validate={[required]}
            />

            <div className="row mt-2">
              <div className="col-md-2 mb-1">
                <Button type="submit" disabled={pristine || submitting}>
                  {t('general.button.save')}
                </Button>
              </div>
              <div className="col-md-2">
                <Button
                  danger
                  type="button"
                  disabled={pristine || submitting}
                  onClick={reset}
                >
                  {t('general.button.reset')}
                </Button>
              </div>
            </div>
            {success && (
              <div className="float-left">
                <SuccessComponent title="Save successfully" />
              </div>
            )}
            {error && (
              <div>
                <DisplayErrorMessagesComponent messages={error} />
              </div>
            )}
          </form>
        </div>
      </FrameComponent>
    );
  }
}

export default enhance(PartnerGeneralSetting);
