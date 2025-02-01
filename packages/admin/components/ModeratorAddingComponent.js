import { Field, Fields, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import {
  FormFields,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  addModeratorErrorMessageSelector,
  addNewModerator
} from '../stores/AdminState';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import { Grid, Typography } from '@material-ui/core';
const {
  RenderDayMonthYearFieldsComponent,
  RenderFieldComponent,
  RenderSelectFieldComponent,
  RenderPasswordFieldComponent
} = FormFields;
const { titleOptions } = OPTIONS;
const { required, passwordValidation, email } = VALIDATIONS;
const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: addModeratorErrorMessageSelector
  }),
  dispatch => ({
    onSubmit: values => {
      values.birthDateString = `${values.month}/${values.day}/${values.year}`;
      dispatch(addNewModerator(values));
    }
  })
);

const withForm = reduxForm({ form: 'addModerator' });
const enhance = compose(connectToRedux, withTranslation('moderator'), withForm);

class ModeratorAddingComponent extends React.Component {
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
          header={<Typography variant="h6">{t('add_new.title')}</Typography>}
          body={
            <form onSubmit={handleSubmit}>
              <Grid container direction="row">
                <Field
                  name="username"
                  component={RenderFieldComponent}
                  col={6}
                  placeholder={t('add_new.username_placeholder')}
                  validate={[required]}
                  label={t('add_new.username')}
                />
                <Field
                  name="password"
                  component={RenderPasswordFieldComponent}
                  type="password"
                  placeholder={t('add_new.password_placeholder')}
                  icon="key"
                  col={6}
                  validate={[passwordValidation, required]}
                  label={t('add_new.password')}
                />
                <Field
                  name="email"
                  component={RenderFieldComponent}
                  placeholder={t('add_new.email_placeholder')}
                  col={12}
                  validate={[required, email]}
                  label={t('add_new.email')}
                />
                <Field
                  name="title"
                  component={RenderSelectFieldComponent}
                  options={titleOptions}
                  col={4}
                  validate={[required]}
                  label={t('add_new.select_title')}
                />
                <Field
                  name="firstName"
                  component={RenderFieldComponent}
                  col={4}
                  type="text"
                  placeholder={t('add_new.first_name_placeholder')}
                  validate={[required]}
                  label={t('add_new.first_name')}
                />
                <Field
                  name="lastName"
                  component={RenderFieldComponent}
                  col={4}
                  type="text"
                  placeholder={t('add_new.last_name_placeholder')}
                  validate={[required]}
                  label={t('add_new.last_name')}
                />

                <Fields
                  label={t('add_new.birth_date')}
                  names={['year', 'month', 'day']}
                  component={RenderDayMonthYearFieldsComponent}
                  validate={[required]}
                />
                <Grid container justify="center">
                  <Grid>
                    <Button type="submit" disabled={pristine || submitting}>
                      {t('add_new.add_button')}
                    </Button>
                    <Button
                      type="button"
                      disabled={pristine || submitting}
                      onClick={reset}
                    >
                      {t('add_new.reset_button')}
                    </Button>
                  </Grid>
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

export default enhance(ModeratorAddingComponent);
