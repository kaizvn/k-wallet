import { APP_ACTIONS, STATUS } from '@revtech/rev-shared/enums';
import { Button, InfoLayout } from '@revtech/rev-shared/layouts';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import {
  FrameComponent,
  FrameHeaderComponent,
  UserStatusComponent
} from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  approveUser,
  banUser,
  unbanUser,
  rejectUser,
  GetUserDetailsSelector,
  getUserDetailsAPI
} from '../stores/AdminState';

const { U_ACTIVE, U_BANNED, U_PENDING } = STATUS;
const { U_APPROVE, U_BAN, U_REJECT, U_UNBAN } = APP_ACTIONS;

const connectToRedux = connect(
  createStructuredSelector({
    user: GetUserDetailsSelector
  }),
  dispatch => ({
    getUserDetails: id => dispatch(getUserDetailsAPI(id)),
    approveUser: id => dispatch(approveUser(id)),
    rejectUser: id => dispatch(rejectUser(id)),
    banUser: id => dispatch(banUser(id)),
    unbanUser: id => dispatch(unbanUser(id))
  })
);
class UserDetailsComponent extends React.Component {
  componentWillMount() {
    this.props.getUserDetails(Router.query.id);
  }

  render() {
    const { user, approveUser, rejectUser, banUser, unbanUser, t } = this.props;
    const rows = [
      { label: 'Fullname', key: 'fullname' },
      { label: 'Username', key: 'username' },
      { label: 'Country', key: 'country' },
      { label: 'Gender', key: 'gender' },
      { label: 'Identity', key: 'identity' },
      { label: 'Email', key: 'email' },
      { label: 'Join Date', key: 'joinDate' },
      { label: 'Birth Date', key: 'birthDate' },
      { label: 'Age', key: 'age' },
      { label: 'Status', key: 'status' }
    ];
    let displays = {};
    if (user)
      displays = {
        fullname: user.fullName,
        username: user.username,
        country: user.country,
        gender: user.gender,
        identity: user.identity,
        email: user.email,
        joinDate: <Moment format={DATE_TIME_FORMAT}>{user.createdAt}</Moment>,
        birthDate: <Moment format={DATE_TIME_FORMAT}>{user.birthDate}</Moment>,
        age: user.age,
        status: <UserStatusComponent t={t} status={user.status} />
      };
    return !user ? (
      <div />
    ) : (
      <FrameComponent>
        <FrameHeaderComponent title="User Details">
          {user.status === U_ACTIVE && (
            <Button type="submit" onClick={() => banUser(user.id)}>
              {U_BAN}
            </Button>
          )}
          {user.status === U_BANNED && (
            <Button type="submit" onClick={() => unbanUser(user.id)}>
              {U_UNBAN}
            </Button>
          )}
          {user.status === U_PENDING && (
            <React.Fragment>
              <Button type="submit" onClick={() => approveUser(user.id)}>
                {U_APPROVE}
              </Button>
              <Button type="button" danger onClick={() => rejectUser(user.id)}>
                {U_REJECT}
              </Button>
            </React.Fragment>
          )}
        </FrameHeaderComponent>
        <div className="card-block table-responsive">
          <InfoLayout
            title="Profile Info"
            subtitle=""
            rows={rows}
            displays={displays}
          />
        </div>
      </FrameComponent>
    );
  }
}

export default connectToRedux(UserDetailsComponent);
