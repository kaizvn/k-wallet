import { Field, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import Router from 'next/router';

import { currentUserSelector, editUserInfo } from '../stores/UserState';
import { Button, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { FormFields } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import { VALIDATIONS } from '@revtech/rev-shared/utils';

const { RenderFieldComponent } = FormFields;

const { email, required } = VALIDATIONS;
const connectToRedux = connect(
  createStructuredSelector({
    initialValues: currentUserSelector
  }),
  dispatch => ({
    onSubmit: values => {
      dispatch(
        editUserInfo({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email
        })
      );
    }
  })
);

const withForm = reduxForm({ form: 'editProfile' });
const enhance = compose(connectToRedux, withForm, withTranslation('common'));

const useStyles = makeStyles(theme => ({
  label: {
    padding: theme.spacing(2, 2, 0, 2)
  }
}));
const EditAdminProfileComponent = ({
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
                    {t('edit_profile.label.admin_name')}
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <Grid container>
                    <Field
                      col={6}
                      name="firstName"
                      component={RenderFieldComponent}
                      validate={[required]}
                    />
                    <Field
                      col={6}
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

export default enhance(EditAdminProfileComponent);
