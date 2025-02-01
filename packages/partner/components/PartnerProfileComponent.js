import {
  InfoLayout,
  Button,
  RLink,
  CardSimpleLayout
} from '@revtech/rev-shared/layouts';
import { PartnerStatusComponent } from '@revtech/rev-shared/components';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';

import { currentUserSelector } from '../stores/UserState';
import { Grid, Typography } from '@material-ui/core';

const connectToRedux = connect(
  createStructuredSelector({
    displays: currentUserSelector
  }),
  null
);
const enhance = compose(connectToRedux, withTranslation('common'));
const PartnerProfileComponent = ({ displays, onEdit, onChangePassword, t }) => {
  const rows = [
    { label: t('profile.title.username'), key: 'username' },
    { label: t('profile.title.fullname'), key: '_fullName' },
    { label: t('profile.title.email'), key: 'email' },
    { label: t('profile.title.date_of_birth'), key: 'birthDate' },
    { label: t('profile.title.status'), key: 'status' }
  ];
  displays = {
    ...displays,
    status: <PartnerStatusComponent t={t} status={displays.status} />,
    birthDate: (
      <Moment format="MM/DD/YYYY">{new Date(displays.birthDate)}</Moment>
    ),
    _fullName: displays.title + '. ' + displays.fullName
  };
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

export default enhance(PartnerProfileComponent);
