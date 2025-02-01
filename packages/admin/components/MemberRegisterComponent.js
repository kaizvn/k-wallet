import { Field, Fields, reduxForm } from 'redux-form';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Link from 'next/link';
import React from 'react';
import {
  FormFields,
  CountrySelectorComponent,
  DisplayErrorMessagesComponent
} from '@revtech/rev-shared/components';
import {
  registerPartnerMember,
  registerMemberErrorSelector
} from '../stores/UserState';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import { Button } from '@revtech/rev-shared/layouts';

const { titleOptions } = OPTIONS;
const { email, idField, numberValidation, required, zipCode } = VALIDATIONS;
const {
  RenderDayMonthYearFieldsComponent,
  RenderFieldComponent,
  RenderSelectFieldComponent,
  RenderFieldWithIconComponent
} = FormFields;

const connectToRedux = connect(
  createStructuredSelector({
    errorMessages: registerMemberErrorSelector
  }),
  dispatch => ({
    onSubmit: values => {
      values.birthDateString = `${values.month}/${values.day}/${values.year}`;
      dispatch(registerPartnerMember(values));
    }
  })
);

const withForm = reduxForm({ form: 'member_register_form' });
const enhance = compose(connectToRedux, withForm);

const MemberRegisterComponent = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  initialValues,
  errorMessages
}) => (
  <div className="ks-page">
    <div className="ks-page-content">
      <div className="ks-logo">Smart City</div>
      <div className="card panel panel-default ks-light ks-panel sc-register sc-form-group">
        <div className="card-block">
          <form
            className="form-container form-lg-container "
            onSubmit={handleSubmit}
          >
            <h4 className="ks-header">ACCOUNT INFO</h4>
            <div className="form-group row">
              <Field
                name="username"
                component={RenderFieldWithIconComponent}
                type="text"
                col="6"
                icon="user"
                placeholder="User Name"
                validate={[required, idField]}
              />
              <Field
                name="password"
                component={RenderFieldWithIconComponent}
                type="password"
                placeholder="Password"
                col="6"
                icon="key"
                validate={[required]}
              />
            </div>
            <div className="form-group row">
              <div className="col-12 col-md-6">
                <Field
                  name="email"
                  type="email"
                  component={RenderFieldWithIconComponent}
                  placeholder="Email"
                  icon="at"
                  disabled={initialValues.email}
                  validate={[required, email]}
                />{' '}
              </div>
              <div className="col-12 col-md-6">
                <div className="form-group row">
                  <div className="col-5 col-md-4">
                    <Field
                      className="form-control"
                      name="mccCode"
                      component={RenderFieldComponent}
                      type="text"
                      placeholder="e.g: +1"
                      validate={[required]}
                    />{' '}
                  </div>
                  <div className="col-7 col-md-8">
                    <Field
                      className="form-control"
                      name="phone"
                      component={RenderFieldComponent}
                      type="text"
                      placeholder="Phone number"
                      validate={[required, e => numberValidation(e)]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form-group row">
              <div className="col-2 col-md-2 mb-2">
                <Field
                  name="title"
                  component={RenderSelectFieldComponent}
                  options={titleOptions}
                  className="form-control"
                  col="12"
                  validate={[required]}
                />
              </div>

              <Field
                className="form-control"
                name="firstName"
                component={RenderFieldComponent}
                col="5"
                type="text"
                placeholder="First Name"
                validate={[required]}
              />

              <Field
                className="form-control"
                col="5"
                name="lastName"
                component={RenderFieldComponent}
                type="text"
                placeholder="Last Name"
                validate={[required]}
              />
            </div>

            <Fields
              label="Birth Date"
              names={['year', 'month', 'day']}
              component={RenderDayMonthYearFieldsComponent}
              validate={[required]}
            />
            <div className="form-group row">
              <div className="col-4 col-md-4">
                <Field
                  className="form-control"
                  name="identity"
                  component={RenderFieldComponent}
                  type="text"
                  placeholder="ID No. / Passport No."
                  validate={[required]}
                />
              </div>

              <div className="col-8 col-md-8">
                <Fields
                  names={['country', 'region']}
                  component={CountrySelectorComponent}
                  validate={[required]}
                />
              </div>
            </div>
            <div className="form-group row">
              <Field
                name="zipCode"
                type="text"
                component={RenderFieldComponent}
                col="3"
                validate={[required, zipCode]}
                placeholder="Zip Code"
              />

              <Field
                className="form-control"
                name="address"
                component={RenderFieldComponent}
                col="9"
                type="text"
                placeholder="Address"
                validate={[required]}
              />
            </div>
            <div className="form-group row">
              <div className="col-6 col-md-6">
                <Button disabled={pristine || submitting} type="submit">
                  Register
                </Button>
              </div>
              <div className="col-6 col-md-6">
                <Button type="reset" onClick={reset} danger>
                  Reset
                </Button>
              </div>
            </div>

            <div>
              <DisplayErrorMessagesComponent messages={errorMessages} />
            </div>
            <div className="ks-text-center">
              <span className="text-muted">
                By clicking <strong>"Register"</strong> I agree the
              </span>
              <a href="#"> Terms Of Service</a>
            </div>
            <div className="ks-text-center">
              Already have an account?{' '}
              <Link href="/partner/login">
                <a>Login</a>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);

export default enhance(MemberRegisterComponent);
