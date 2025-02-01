import {
  DATE_TIME_FORMAT,
  InformationComponent
} from '@revtech/rev-shared/utils';
import {
  UserStatusComponent,
  MissingInfoComponent
} from '@revtech/rev-shared/components';
import { InfoLayout, CardSimpleLayout } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import { getPartnerMemberDetails } from '@revtech/rev-shared/apis/actions';
import { getPartnerMemberDetailsSelector } from '@revtech/rev-shared/apis/selectors';
import { Typography, Grid } from '@material-ui/core';

const connectToRedux = connect(
  createStructuredSelector({
    member: getPartnerMemberDetailsSelector
  }),
  dispatch => ({
    getPartnerUserDetails: id => dispatch(getPartnerMemberDetails(id))
  })
);

const enhance = compose(connectToRedux, withTranslation(['partner', 'common']));
class MemberDetailsComponent extends React.Component {
  componentDidMount() {
    this.props.getPartnerUserDetails(Router.query.id);
  }
  render() {
    const { member, t } = this.props;
    const rows = [
      {
        label: t('user.detail.member_details.label.username'),
        key: 'username'
      },
      {
        label: t('user.detail.member_details.label.fullname'),
        key: 'fullname'
      },
      {
        label: t('user.detail.member_details.label.partner_id'),
        key: 'partnerId'
      },
      { label: t('user.detail.member_details.label.gender'), key: 'gender' },
      { label: t('user.detail.member_details.label.email'), key: 'email' },
      {
        label: t('user.detail.member_details.label.join_date'),
        key: 'joinDate'
      },
      {
        label: t('user.detail.member_details.label.birth_date'),
        key: 'birthDate'
      },
      { label: t('user.detail.member_details.label.status'), key: 'status' },
      { label: t('user.detail.member_details.label.role'), key: 'role' }
    ];
    let displays = {};
    if (member)
      displays = {
        username: member.username,
        partnerId: (
          <InformationComponent>
            {member.partner.partnerId}
          </InformationComponent>
        ),
        fullname: member.fullName,
        gender: member.gender,
        email: member.email,
        joinDate: <Moment format={DATE_TIME_FORMAT}>{member.createdAt}</Moment>,
        birthDate:
          member.birthMonth + '/' + member.birthDay + '/' + member.birthYear,
        status: <UserStatusComponent t={t} status={member.status} />,
        role: member.role
      };
    return !member ? (
      <MissingInfoComponent>
        <Typography color="secondary" variant="h5">
          {t('common:rev_shared.message.not_found_user')}
        </Typography>
      </MissingInfoComponent>
    ) : (
      <Grid container justify="center">
        <Grid xs={12} item className="shadow-0">
          <CardSimpleLayout
            header={
              <Typography variant="h6">
                {t('user.detail.member_details.title')}
              </Typography>
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
    );
  }
}

export default enhance(MemberDetailsComponent);
