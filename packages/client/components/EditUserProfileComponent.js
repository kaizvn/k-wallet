import {
  Button,
  RLink,
  Switch,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { Field, Fields, reduxForm } from 'redux-form';
import {
  FormFields,
  SuccessComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { getbackUrl } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';
import Router from 'next/router';
import { getStateEnable2FA } from '@revtech/rev-shared/apis/actions';
import { getStateEnable2FASelector } from '@revtech/rev-shared/apis/selectors';
import { getStateEnable2FAAPIResetter } from '@revtech/rev-shared/apis/resetters';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import {
  resetGetCurrentUser,
  currentUserSelector,
  editUserInfo,
  resetEditUserInfo,
  editUserInfoErrorMessageSelector,
  editUserInfoSuccessMessageSelector
} from '../stores/UserState';
import { Grid } from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

const { email, required } = VALIDATIONS;

const {
  RenderImageFieldComponent,
  RenderDayMonthYearFieldsComponent,
  RenderFieldComponent,
  RenderSelectFieldComponent
} = FormFields;

const { titleOptions } = OPTIONS;

const connectToRedux = connect(
  (state) => ({
    initialValues: {
      ...currentUserSelector(state),
      day: currentUserSelector(state).birthDay,
      month: currentUserSelector(state).birthMonth,
      year: currentUserSelector(state).birthYear
    },
    success: editUserInfoSuccessMessageSelector(state),
    error: editUserInfoErrorMessageSelector(state),
    isEnable2FAData: getStateEnable2FASelector(state)
  }),
  (dispatch) => ({
    onSubmit: (values) => {
      let birthDateString = values.month + '-' + values.day + '-' + values.year;
      resetGetCurrentUser(dispatch);
      dispatch(
        editUserInfo({
          ...values,
          birthDateString
        })
      );
    },
    getStateEnable2FA: () => dispatch(getStateEnable2FA()),
    resetData: () => {
      resetGetCurrentUser(dispatch);
      resetEditUserInfo(dispatch);
      dispatch(getStateEnable2FAAPIResetter);
    }
  })
);
const withForm = reduxForm({ form: 'editProfile', enableReinitialize: true });
const withTwoFactorEnabled = withState('isEnable2FA', 'setIsEnable2FA');
const enhance = compose(
  connectToRedux,
  withForm,
  withTwoFactorEnabled,
  withTranslation(['user', 'common'])
);

class EditUserProfileComponent extends React.Component {
  componentDidMount() {
    this.props.getStateEnable2FA();
  }
  componentDidUpdate(prevProps) {
    const { isEnable2FAData, setIsEnable2FA } = this.props;

    if (isEnable2FAData !== prevProps.isEnable2FA)
      setIsEnable2FA(isEnable2FAData);
  }
  componentWillUnmount() {
    this.props.resetData();
  }
  render() {
    const {
      reset,
      submitting,
      pristine,
      success,
      error,
      handleSubmit,
      isEnable2FA,
      setIsEnable2FA,
      t
    } = this.props;

    return (
      <Grid container>
        <Grid style={{ padding: '0px 0px 24px 24px' }} container>
          <RLink href={getbackUrl(Router.router.pathname, '')}>
            <Button startIcon={<ArrowBackIos />}>
              {t('profile.button.back')}
            </Button>
          </RLink>
        </Grid>
        <Grid container justify="center">
          <Grid item xs={10} sm={10} md={8} lg={6} className="shadow">
            <CardSimpleLayout
              header={
                <Grid
                  style={{ fontWeight: 700, fontSize: 18 }}
                  container
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid>{t('profile.information.title')}</Grid>
                  <Grid>
                    <Grid container direction="row">
                      {t('profile.information.label.two_step_verifycation')}
                      <Switch
                        onChange={() => {
                          setIsEnable2FA(!isEnable2FA);
                          Router.push('/user/two-factor-authen');
                        }}
                        checked={isEnable2FA || false}
                        t={t}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              }
              body={
                <form onSubmit={handleSubmit}>
                  <Grid container direction="row">
                    <Field
                      name="avatar"
                      component={RenderImageFieldComponent}
                    />
                    <Grid item xs={12}>
                      <label style={{ padding: `0px 16px` }}>
                        {t('profile.information.label.yourname')}
                      </label>
                    </Grid>
                    <Field
                      col={2}
                      name="title"
                      component={RenderSelectFieldComponent}
                      options={titleOptions}
                      validate={[required]}
                    />
                    <Field
                      col={5}
                      placeholder={t(
                        'profile.information.placeholder.firstname'
                      )}
                      name="firstName"
                      component={RenderFieldComponent}
                      validate={[required]}
                    />
                    <Field
                      col={5}
                      placeholder={t(
                        'profile.information.placeholder.lastname'
                      )}
                      name="lastName"
                      component={RenderFieldComponent}
                      validate={[required]}
                    />
                    <Grid item xs={12}>
                      <label style={{ padding: `0px 16px` }}>
                        {t('profile.information.label.email')}
                      </label>
                    </Grid>
                    <Field
                      col={12}
                      name="email"
                      component={RenderFieldComponent}
                      validate={[required, email]}
                    />
                    <Fields
                      label="Birth Date"
                      names={['year', 'month', 'day']}
                      component={RenderDayMonthYearFieldsComponent}
                    />

                    <Grid container justify="center">
                      <RLink href="/user/changepassword">
                        <Button>
                          {t('profile.information.button.change_password')}
                        </Button>
                      </RLink>
                      <Button type="submit" disabled={pristine || submitting}>
                        {t('profile.information.button.save')}
                      </Button>
                      <Button disabled={pristine || submitting} onClick={reset}>
                        {t('profile.information.button.reset')}
                      </Button>
                    </Grid>
                  </Grid>
                  {success && (
                    <SuccessComponent title={t('common:save_success')} />
                  )}
                  {error && <DisplayErrorMessagesComponent messages={error} />}
                </form>
              }
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
export default enhance(EditUserProfileComponent);
