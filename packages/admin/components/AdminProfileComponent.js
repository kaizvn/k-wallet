import { connect } from 'react-redux';
import React from 'react';
import { compose } from 'recompose';
import { currentUserSelector } from '../stores/UserState';
import { createStructuredSelector } from 'reselect';
import {
  RLink,
  Button,
  InfoLayout,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Grid, Typography } from '@material-ui/core';
const connectToRedux = connect(
  createStructuredSelector({
    displays: currentUserSelector
  }),
  null
);
const enhance = compose(connectToRedux, withTranslation('common'));
const AdminProfileComponent = ({ displays, onEdit, onChangePassword, t }) => {
  const rows = [
    { label: t('profile.title.username'), key: 'username' },
    { label: t('profile.title.fullname'), key: 'fullName' },
    { label: t('profile.title.email'), key: 'email' }
  ];
  return (
    <Grid container justify="center">
      <Grid lg={10} sm={12} item className="shadow">
        <CardSimpleLayout
          header={
            <Grid container justify="space-between" alignItems="center">
              <Typography variant="h5">
                {t('profile.title.your_profile')}
              </Typography>
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
          footer={
            <Grid container spacing={3} justify="flex-end">
              <RLink href="/profile/edit">
                <Button onClick={onEdit}>{t('profile.button.edit')}</Button>
              </RLink>
              <RLink href="/changepassword">
                <Button onClick={onChangePassword}>
                  {t('profile.button.change_password')}
                </Button>
              </RLink>
            </Grid>
          }
        />
      </Grid>
    </Grid>
  );
};

export default enhance(AdminProfileComponent);
