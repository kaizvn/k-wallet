import { Field, Fields, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import React from 'react';
import Router from 'next/router';

import { currentUserSelector, editUserInfo } from '../stores/UserState';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { FormFields } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';

const {
  RenderDayMonthYearFieldsComponent,
  RenderFieldComponent,
  RenderSelectFieldComponent
} = FormFields;
const { titleOptions } = OPTIONS;
const { email, required } = VALIDATIONS;
const connectToRedux = connect(
  state => ({
    initialValues: {
      ...currentUserSelector(state),
      day: currentUserSelector(state).birthDay,
      month: currentUserSelector(state).birthMonth,
      year: currentUserSelector(state).birthYear
    }
  }),
  dispatch => ({
    onSubmit: values => {
      let birthDateString = values.month + '-' + values.day + '-' + values.year;
      dispatch(
        editUserInfo({
          ...values,
          birthDateString
        })
      );
      Router.push('/profile');
    }
  })
);
const withForm = reduxForm({ form: 'editProfile' });
const enhance = compose(connectToRedux, withForm, withTranslation('common'));

const useStyles = makeStyles(theme => ({
  label: {
    padding: theme.spacing(2)
  }
}));

const EditPartnerProfileComponent = ({
  initialValues,
  reset,
  submitting,
  pristine,
  handleSubmit,
  t
}) => {
  const classes = useStyles();
  return (
    <Grid container justify="center">
      <Grid item md={10} lg={8} className="shadow">
        <CardSimpleLayout
          header={
            <Typography variant="h5">{t('edit_profile.title')}</Typography>
          }
          body={
            <form className="mt-4" onSubmit={handleSubmit}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <label className={classes.label}>
                    {t('edit_profile.label.partner_name')}
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Field
                      col={2}
                      name="title"
                      component={RenderSelectFieldComponent}
                      options={titleOptions}
                      validate={[required]}
                    />
                    <Field
                      col={5}
                      name="firstName"
                      component={RenderFieldComponent}
                      validate={[required]}
                    />
                    <Field
                      col={5}
                      name="lastName"
                      component={RenderFieldComponent}
                      validate={[required]}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <label className={classes.label}>
                    {t('edit_profile.label.email')}
                  </label>
                  <Field
                    col={12}
                    name="email"
                    component={RenderFieldComponent}
                    validate={[required, email]}
                  />
                </Grid>

                <Fields
                  label="Birth Date"
                  names={['year', 'month', 'day']}
                  component={RenderDayMonthYearFieldsComponent}
                  initialValues={initialValues}
                  validate={[required]}
                />

                <Grid container justify="center">
                  <Button type="submit" disabled={pristine || submitting}>
                    {t('edit_profile.button.save')}
                  </Button>
                  <Button
                    color="secondary"
                    disabled={pristine || submitting}
                    onClick={reset}
                  >
                    {t('edit_profile.button.reset')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          }
        />
      </Grid>
    </Grid>
  );
};

export default enhance(EditPartnerProfileComponent);
