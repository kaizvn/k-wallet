import { Field, Fields, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Link from 'next/link';
import React from 'react';

import {
  registerErrorMessagesSelector,
  registerPartnerUser
} from '../stores/UserState';

import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import {
  FormFields,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid, makeStyles } from '@material-ui/core';

const {
  email,
  idField,
  numberValidation,
  required,
  passwordValidation
} = VALIDATIONS;

const { titleOptions } = OPTIONS;

const {
  RenderDayMonthYearFieldsComponent,
  RenderFieldComponent,
  RenderSelectFieldComponent,
  RenderPasswordFieldComponent
} = FormFields;

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: registerErrorMessagesSelector
  }),
  dispatch => ({
    onSubmit: values => {
      values.birthDateString = `${values.month}/${values.day}/${values.year}`;
      dispatch(registerPartnerUser(values));
    }
  })
);

const withForm = reduxForm({ form: 'partner_owner_register_form' });

const enhance = compose(
  connectToRedux,
  withForm,
  withTranslation('login-register')
);

const useStyles = makeStyles(theme => ({
  title: {
    padding: `0px ${theme.spacing(2)}px`
  },
  term: {
    padding: `${theme.spacing(2)}px 0px`
  },
  textMute: {
    color: '#6c757d'
  }
}));

const RegisterComponent = ({
  handleSubmit,
  pristine,
  submitting,
  initialValues,
  errorMessages,
  t
}) => {
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid item sm={10} md={8} lg={6} className="shadow">
        <CardSimpleLayout
          header={
            <Grid container justify="center">
              <h3>{t('register.title.sign_up')}</h3>
            </Grid>
          }
          body={
            <form onSubmit={handleSubmit}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t('register.title.account_info')}
                  </h4>
                </Grid>
                <Field
                  name="username"
                  component={RenderFieldComponent}
                  col={6}
                  placeholder={t('register.placeholder.username')}
                  label={t('register.label.username')}
                  validate={[required, idField]}
                />
                <Field
                  name="password"
                  component={RenderPasswordFieldComponent}
                  type="password"
                  placeholder={t('register.placeholder.password')}
                  validate={[passwordValidation, required]}
                />
                <Field
                  col={6}
                  name="email"
                  type="email"
                  component={RenderFieldComponent}
                  placeholder={t('register.placeholder.email')}
                  label={t('register.label.email')}
                  disabled={!!initialValues.email}
                  validate={[required, email]}
                />
                <Grid item md={6} sm={12}>
                  <Grid container direction="row">
                    <Field
                      col={4}
                      name="mccCode"
                      component={RenderFieldComponent}
                      placeholder={t('register.placeholder.mcc_code')}
                      label={t('register.label.mcc_code')}
                      validate={[required]}
                    />
                    <Field
                      col={8}
                      name="phone"
                      component={RenderFieldComponent}
                      placeholder={t('register.placeholder.phone_number')}
                      label={t('register.label.phone_number')}
                      validate={[required, e => numberValidation(e)]}
                    />
                  </Grid>
                </Grid>
                <Field
                  col={2}
                  name="title"
                  component={RenderSelectFieldComponent}
                  options={titleOptions}
                  validate={[required]}
                />
                <Field
                  name="firstName"
                  component={RenderFieldComponent}
                  col={5}
                  placeholder={t('register.placeholder.firstname')}
                  label={t('register.label.firstname')}
                  validate={[required]}
                />

                <Field
                  col={5}
                  name="lastName"
                  component={RenderFieldComponent}
                  placeholder={t('register.placeholder.lastname')}
                  label={t('register.label.lastname')}
                  validate={[required]}
                />

                <Fields
                  names={['year', 'month', 'day']}
                  component={RenderDayMonthYearFieldsComponent}
                  validate={[required]}
                />
                <Field
                  col={12}
                  name="identity"
                  component={RenderFieldComponent}
                  placeholder={t('register.placeholder.id_passport')}
                  label={t('register.label.id_passport')}
                  validate={[required]}
                />
                <Grid item xs={12}>
                  <h4 className={classes.title}>
                    {t('register.title.partner_info')}
                  </h4>
                </Grid>
                <Field
                  name="partnerId"
                  component={RenderFieldComponent}
                  col={4}
                  placeholder={t('register.placeholder.partner_id')}
                  label={t('register.label.partner_id')}
                  disabled={!!initialValues.partnerId}
                  validate={[required]}
                />
                <Field
                  name="partnerName"
                  component={RenderFieldComponent}
                  col={8}
                  placeholder={t('register.placeholder.partner_name')}
                  label={t('register.label.partner_name')}
                  validate={[required]}
                />

                <Field
                  name="partnerPhone"
                  component={RenderFieldComponent}
                  col={4}
                  placeholder={t('register.placeholder.partner_phone')}
                  label={t('register.label.partner_phone')}
                  validate={[required]}
                />

                <Field
                  name="partnerEmail"
                  component={RenderFieldComponent}
                  col={4}
                  placeholder={t('register.placeholder.partner_email')}
                  label={t('register.label.partner_email')}
                  validate={[required, email]}
                />

                <Field
                  name="partnerAddress"
                  component={RenderFieldComponent}
                  col={4}
                  placeholder={t('register.placeholder.partner_address')}
                  label={t('register.label.partner_address')}
                />

                <Grid container justify="center">
                  <Button disabled={pristine || submitting} type="submit">
                    {t('register.button.register')}
                  </Button>
                </Grid>
                <DisplayErrorMessagesComponent messages={errorMessages} />
                <Grid container direction="column" className={classes.term}>
                  <Grid container justify="center">
                    <span className={classes.textMute}>
                      {t('register.label.label_normal.terms')}
                    </span>
                    <span>&nbsp;&nbsp;</span>
                    <a href="#">{t('register.label.label_link.terms')}</a>
                  </Grid>
                  <Grid container justify="center">
                    {t('register.label.label_normal.already_account')}
                    <span>&nbsp;&nbsp;</span>
                    <Link href="/login">
                      <a>{t('register.label.label_link.login')}</a>
                    </Link>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          }
        />
      </Grid>
    </Grid>
  );
};

export default enhance(RegisterComponent);
