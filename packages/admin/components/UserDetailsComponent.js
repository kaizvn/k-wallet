import {
  Button,
  InfoLayout,
  InputText,
  AlertDialog,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import {
  DATE_TIME_FORMAT,
  doFunctionWithEnter
} from '@revtech/rev-shared/utils';
import {
  UserStatusComponent,
  CopyTextComponent,
  DisplayErrorMessagesComponent,
  MissingInfoComponent
} from '@revtech/rev-shared/components';
import { STATUS } from '@revtech/rev-shared/enums';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import { upperCase } from 'lodash/fp';

import {
  approveUser,
  banUser,
  unbanUser,
  rejectUser,
  getUserDetailsSelector,
  getUserDetailsAPI
} from '../stores/AdminState';
import { updatePasswordUser } from '../stores/UserState';
import UserWalletsComponent from './UserWalletsComponent';
import { verifyPassword } from '@revtech/rev-shared/apis/actions';
import {
  verifyPasswordSelector,
  verifyPasswordErrorMessageSelector
} from '@revtech/rev-shared/apis/selectors';
import { verifyPasswordAPIResetter } from '@revtech/rev-shared/apis/resetters';
import generator from 'generate-password';
import { Typography, Grid, Divider } from '@material-ui/core';

const { U_ACTIVE, U_BANNED, U_PENDING } = STATUS;

const connectToRedux = connect(
  createStructuredSelector({
    user: getUserDetailsSelector,
    isVerifyPassword: verifyPasswordSelector,
    verifyPasswordErrorMesage: verifyPasswordErrorMessageSelector
  }),
  dispatch => ({
    getUserDetails: id => dispatch(getUserDetailsAPI(id)),
    approveUser: id => dispatch(approveUser(id)),
    rejectUser: id => dispatch(rejectUser(id)),
    banUser: id => dispatch(banUser(id)),
    unbanUser: id => dispatch(unbanUser(id)),
    verifyPassword: password => dispatch(verifyPassword(password)),
    resetVerifyPassword: () => {
      dispatch(verifyPasswordAPIResetter);
    },
    updatePasswordUser: (id, newPassword) =>
      dispatch(updatePasswordUser(id, newPassword))
  })
);

const enhance = compose(connectToRedux, withTranslation(['user', 'common']));
const SUGGESTED_PASSWORD = generator.generate({
  length: 8,
  numbers: true
});

const UserDetailsComponent = ({
  user,
  approveUser,
  rejectUser,
  banUser,
  unbanUser,
  verifyPassword,
  isVerifyPassword,
  verifyPasswordErrorMesage,
  updatePasswordUser,
  t,
  resetVerifyPassword,
  getUserDetails
}) => {
  const [password, setPassword] = useState('');
  const [isUpdatedPassword, setIsUpdatedPassword] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    getUserDetails(Router.query.id);
    return () => {
      resetVerifyPassword();
    };
  }, [getUserDetails, resetVerifyPassword]);

  useEffect(() => {
    setIsUpdatedPassword(true);
  }, [isVerifyPassword, setIsUpdatedPassword]);

  useEffect(() => {
    if (isVerifyPassword && !isUpdatedPassword && user) {
      updatePasswordUser(user.id, SUGGESTED_PASSWORD);
    }
  }, [isUpdatedPassword, isVerifyPassword, user, updatePasswordUser]);

  const rows = [
    { label: t('detail.user_details.label.fullname'), key: 'fullname' },
    { label: t('detail.user_details.label.username'), key: 'username' },
    { label: t('detail.user_details.label.gender'), key: 'gender' },
    { label: t('detail.user_details.label.identity'), key: 'identity' },
    { label: t('detail.user_details.label.email'), key: 'email' },
    { label: t('detail.user_details.label.join_date'), key: 'joinDate' },
    { label: t('detail.user_details.label.birth_date'), key: 'birthDate' },
    { label: t('detail.user_details.label.age'), key: 'age' },
    { label: t('detail.user_details.label.status'), key: 'status' }
  ];
  let displays = {};
  if (user)
    displays = {
      fullname: user.fullName,
      username: user.username,
      gender: user.gender,
      identity: user.identity,
      email: user.email,
      joinDate: <Moment format={DATE_TIME_FORMAT}>{user.createdAt}</Moment>,
      birthDate: user.birthDate,
      age: user.age,
      status: <UserStatusComponent t={t} status={user.status} />
    };

  return !user ? (
    <MissingInfoComponent>
      <Typography variant="h5" color="secondary">
        {t('common:rev_shared.message.not_found_user')}
      </Typography>
    </MissingInfoComponent>
  ) : (
    <Grid>
      <AlertDialog
        title={t('common:rev_shared.reset_password.label.reset_password')}
        onOk={() => password && verifyPassword(password)}
        okContent={t(
          'common:rev_shared.reset_password.button.get_new_password'
        )}
        onCancel={() => setIsOpenModal(false)}
        cancelContent={t('common:rev_shared.popup.button.close')}
        destroyOnOk={isVerifyPassword}
        destroyOnCancel={isVerifyPassword}
        fullWidth
        size="sm"
        isOpenDialog={isOpenModal}
        setIsOpenDialog={setIsOpenModal}
        content={
          <div>
            {isVerifyPassword ? (
              <div>
                <CopyTextComponent
                  label={`${t(
                    'common:rev_shared.reset_password.message.generate_password_success'
                  )} ${displays.fullname}`}
                  text={SUGGESTED_PASSWORD}
                  id="new-password"
                />
              </div>
            ) : (
              <div>
                <InputText
                  label={t(
                    'common:rev_shared.reset_password.message.notify_verify_password'
                  )}
                  size="small"
                  type="password"
                  id="user-reset-password"
                  placeholder={t('common:rev_shared.placeholder.password')}
                  value={password}
                  onChange={value => setPassword(value)}
                  onKeyPress={event =>
                    password &&
                    doFunctionWithEnter(event, () => {
                      verifyPassword(password);
                    })
                  }
                />
                {verifyPasswordErrorMesage && (
                  <DisplayErrorMessagesComponent
                    messages={verifyPasswordErrorMesage}
                  />
                )}
              </div>
            )}
          </div>
        }
      />
      <Grid container justify="center">
        <Grid xs={12} item className="shadow-0">
          <CardSimpleLayout
            header={
              <Grid
                container
                justify="space-between"
                alignItems="center"
                direction="row"
              >
                <Typography variant="h6">
                  {t('detail.user_details.title')}
                </Typography>

                <Grid>
                  <Button onClick={() => setIsOpenModal(true)}>
                    {t('common:rev_shared.reset_password.label.reset_password')}
                  </Button>
                  {user.status === U_ACTIVE && (
                    <Button type="submit" onClick={() => banUser(user.id)}>
                      {upperCase(t('common:actions_button.ban'))}
                    </Button>
                  )}
                  {user.status === U_BANNED && (
                    <Button type="submit" onClick={() => unbanUser(user.id)}>
                      {upperCase(t('common:actions_button.unban'))}
                    </Button>
                  )}
                  {user.status === U_PENDING && (
                    <React.Fragment>
                      <Button
                        type="submit"
                        onClick={() => approveUser(user.id)}
                      >
                        {upperCase(t('common:actions_button.approve'))}
                      </Button>
                      <Button type="button" onClick={() => rejectUser(user.id)}>
                        {upperCase(t('common:actions_button.reject'))}
                      </Button>
                    </React.Fragment>
                  )}
                </Grid>
              </Grid>
            }
            body={
              <InfoLayout
                title="Profile Info"
                subtitle=""
                rows={rows}
                displays={displays}
              />
            }
          />
        </Grid>
      </Grid>
      <Divider style={{ margin: '40px 0px' }} />
      <UserWalletsComponent id={Router.query.id} />
    </Grid>
  );
};

export default enhance(UserDetailsComponent);
