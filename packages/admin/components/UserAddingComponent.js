import { Field, Fields, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import {
  FormFields,
  CountrySelectorComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { addUserErrorMessageSelector, addNewUser } from '../stores/AdminState';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import { Grid } from '@material-ui/core';
const {
  RenderDayMonthYearFieldsComponent,
  RenderFieldComponent,
  RenderSelectFieldComponent,
  RenderPasswordFieldComponent
} = FormFields;
const { titleOptions } = OPTIONS;
const { numberValidation, required, zipCode } = VALIDATIONS;
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: addUserErrorMessageSelector
  }),
  dispatch => ({
    onSubmit: values => {
      values.birthDateString = `${values.month}/${values.day}/${values.year}`;
      dispatch(addNewUser(values));
    }
  })
);

const withForm = reduxForm({ form: 'addUser' });
const enhance = compose(connectToRedux, withTranslation('user'), withForm);

class UserAddingComponent extends React.Component {
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
          header={t('add_new.title')}
          body={
            <form onSubmit={handleSubmit}>
              <Grid container direction="row">
                <Field
                  name="username"
                  component={RenderFieldComponent}
                  col={6}
                  label={t('add_new.username')}
                  placeholder={t('add_new.username_placeholder')}
                  validate={[required]}
                />
                <Field
                  type="password"
                  name="password"
                  component={RenderPasswordFieldComponent}
                  placeholder={t('add_new.password_placeholder')}
                  label={t('add_new.password')}
                  col={6}
                  validate={[required]}
                />
                <Field
                  name="email"
                  component={RenderFieldComponent}
                  placeholder={t('add_new.email_placeholder')}
                  label={t('add_new.email')}
                  col={6}
                  validate={[required]}
                />
                <Field
                  name="address"
                  component={RenderFieldComponent}
                  col={6}
                  label={t('add_new.address')}
                  placeholder={t('add_new.address_placeholder')}
                  validate={[required]}
                />

                <Field
                  name="mccCode"
                  component={RenderFieldComponent}
                  col={3}
                  placeholder={t('add_new.mcc_code_placeholder')}
                  label={t('add_new.mcc_code')}
                  validate={[required]}
                />
                <Field
                  name="phone"
                  component={RenderFieldComponent}
                  label={t('add_new.phone')}
                  col={3}
                  placeholder={t('add_new.phone_placeholder')}
                  validate={[required, e => numberValidation(e)]}
                />
                <Field
                  name="zipCode"
                  component={RenderFieldComponent}
                  col={3}
                  label={t('add_new.zip_code')}
                  validate={[required, zipCode]}
                  placeholder={t('add_new.zip_code_placeholder')}
                />
                <Field
                  name="identity"
                  component={RenderFieldComponent}
                  col={3}
                  label={t('add_new.identity')}
                  placeholder={t('add_new.identity_placeholder')}
                  validate={[required]}
                />
                <Field
                  name="title"
                  component={RenderSelectFieldComponent}
                  options={titleOptions}
                  label={t('add_new.select_title')}
                  col={4}
                  validate={[required]}
                />
                <Field
                  name="firstName"
                  component={RenderFieldComponent}
                  col={4}
                  label={t('add_new.first_name')}
                  placeholder={t('add_new.first_name_placeholder')}
                  validate={[required]}
                />
                <Field
                  name="lastName"
                  component={RenderFieldComponent}
                  col={4}
                  label={t('add_new.last_name')}
                  placeholder={t('add_new.last_name_placeholder')}
                  validate={[required]}
                />
              </Grid>

              <Fields
                label={t('add_new.birth_date')}
                names={['year', 'month', 'day']}
                component={RenderDayMonthYearFieldsComponent}
                validate={[required]}
              />
              <Fields
                names={['country', 'region']}
                component={CountrySelectorComponent}
                validate={[required]}
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
