import React from 'react';
import moment from 'moment';

import { STATUS } from '@revtech/rev-shared/enums';
import PendingUserWarningComponent from './PendingUserWarningComponent';

const { U_PENDING } = STATUS;

const UserCardDetailsComponent = ({ currentUser, logout }) => (
  <div
    className="card panel panel-default ks-light ks-solid"
    style={{ height: '100%' }}
  >
    <h4 className="card-header">Customer Details</h4>
    <div className="card-block">
      <table className="user-details">
        <tbody>
          <tr>
            <td>Full name</td>
            <td>
              {currentUser._fullName} (
              <a href="/" onClick={() => logout()}>
                Logout
              </a>
              )
            </td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{currentUser._status}</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>{currentUser.username}</td>
          </tr>
          <tr>
            <td>Joined date</td>
            <td>{moment(currentUser.createdAt).format('MM-DD-YYYY')}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <a href="#">{currentUser.email}</a>
            </td>
          </tr>
          {currentUser.status === U_PENDING && (
            <tr>
              <td className="text-danger" colSpan="2">
                <PendingUserWarningComponent currentUser={currentUser} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <style jsx>{`
      .user-details tr td {
        padding-bottom: 12px;
      }
      .user-details tr td:first-child {
        width: 50%;
        font-weight: bold;
        text-align: right;
        padding-right: 10%;
      }
      .user-details tr td:last-child {
        width: 49%;
        text-align: left;
      }
    `}</style>
  </div>
);

export default UserCardDetailsComponent;
