import {
  Button,
  InfoLayout,
  CardSimpleLayout,
  AlertDialog,
  InputText
} from '@revtech/rev-shared/layouts';
import { DATEFORMAT, doFunctionWithEnter } from '@revtech/rev-shared/utils';
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
  banUser,
  unbanUser,
  getModeratorDetailsSelector,
  getModeratorDetailsAPI
} from '../stores/AdminState';
import { updatePasswordUser } from '../stores/UserState';
import { verifyPassword } from '@revtech/rev-shared/apis/actions';
import {
  verifyPasswordSelector,
  verifyPasswordErrorMessageSelector
} from '@revtech/rev-shared/apis/selectors';
import { verifyPasswordAPIResetter } from '@revtech/rev-shared/apis/resetters';
import generator from 'generate-password';
import { Typography, Grid } from '@material-ui/core';

const { U_ACTIVE, U_BANNED } = STATUS;
const isModerator = true;
const connectToRedux = connect(
  createStructuredSelector({
    moderator: getModeratorDetailsSelector,
    isVerifyPassword: verifyPasswordSelector,
    verifyPasswordErrorMesage: verifyPasswordErrorMessageSelector
  }),
  dispatch => ({
    getModeratorDetails: id => dispatch(getModeratorDetailsAPI(id)),
    banUser: id => dispatch(banUser(id, isModerator)),
    unbanUser: id => dispatch(unbanUser(id, isModerator)),
    verifyPassword: password => dispatch(verifyPassword(password)),
    resetVerifyPassword: () => {
      dispatch(verifyPasswordAPIResetter);
    },
    updatePasswordUser: (id, newPassword) =>
      dispatch(updatePasswordUser(id, newPassword))
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation(['moderator', 'common'])
);
const SUGGESTED_PASSWORD = generator.generate({
  length: 8,
  numbers: true
});

const ModeratorDetailsComponent = ({
  moderator,
  banUser,
  unbanUser,
  verifyPassword,
  isVerifyPassword,
  verifyPasswordErrorMesage,
  updatePasswordUser,
  t,
  getModeratorDetails,
  resetVerifyPassword
}) => {
  const [password, setPassword] = useState('');
  const [isUpdatedPassword, setIsUpdatedPassword] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    getModeratorDetails(Router.query.id);
    return () => {
      resetVerifyPassword();
    };
  }, [getModeratorDetails, resetVerifyPassword]);

  useEffect(() => {
    setIsUpdatedPassword(true);
  }, [isVerifyPassword, setIsUpdatedPassword]);

  useEffect(() => {
    if (isVerifyPassword && !isUpdatedPassword && moderator) {
      updatePasswordUser(moderator.id, SUGGESTED_PASSWORD);
    }
  }, [isUpdatedPassword, isVerifyPassword, moderator, updatePasswordUser]);
  const rows = [
    { label: t('detail.moderator_details.label.fullname'), key: 'fullname' },
    { label: t('detail.moderator_details.label.username'), key: 'username' },
    { label: t('detail.moderator_details.label.gender'), key: 'gender' },
    { label: t('detail.moderator_details.label.email'), key: 'email' },
    { label: t('detail.moderator_details.label.join_date'), key: 'joinDate' },
    {
      label: t('detail.moderator_details.label.birth_date'),
      key: 'birthDate'
    },
    { label: t('detail.moderator_details.label.age'), key: 'age' },
    { label: t('detail.moderator_details.label.status'), key: 'status' }
  ];
  let displays = {};
  if (moderator)
    displays = {
      fullname: moderator.fullName,
      username: moderator.username,
      gender: moderator.gender,
      email: moderator.email,
      joinDate: <Moment format={DATEFORMAT}>{moderator.createdAt}</Moment>,
      birthDate: moderator.birthDate,
      age: moderator.age,
      status: <UserStatusComponent t={t} status={moderator.status} />
    };

  return !moderator ? (
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
                  id="mod-reset-password"
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
                  {t('detail.moderator_details.title')}
                </Typography>

                <Grid>
                  <Button onClick={() => setIsOpenModal(true)}>
                    {t('common:rev_shared.reset_password.label.reset_password')}
                  </Button>
                  {moderator.status === U_ACTIVE && (
                    <Button type="submit" onClick={() => banUser(moderator.id)}>
                      {upperCase(t('common:actions_button.ban'))}
                    </Button>
                  )}
                  {moderator.status === U_BANNED && (
                    <Button
                      type="submit"
                      onClick={() => unbanUser(moderator.id)}
                    >
                      {upperCase(t('common:actions_button.unban'))}
                    </Button>
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
    </Grid>
  );
};

export default enhance(ModeratorDetailsComponent);
