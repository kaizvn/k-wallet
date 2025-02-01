import { AvatarComponent } from '@revtech/rev-shared/components';
import { Button } from '@revtech/rev-shared/layouts';
import { STATUS } from '@revtech/rev-shared/enums';
import React from 'react';
import moment from 'moment';

import PendingUserWarningComponent from './PendingUserWarningComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

const { U_PENDING } = STATUS;

const UserCardDetailsComponent = ({ currentUser, logout, t }) => (
  <div className="card-block">
    <AvatarComponent url={currentUser.avatar} />
    <h3 className="card-title">{currentUser._fullName}</h3>
    <div className="ks-desc">
      <div className="ks-nickname">{currentUser.email}</div>
      <div className="ks-country">{currentUser.country}</div>
    </div>
    <div className="ks-rate">
      <div className="ks-name">
        {t('user_dashboard.card_detail.username')}:{' '}
        <b>{currentUser.username}</b>
      </div>
      <div className="ks-due-date">
        {t('user_dashboard.card_detail.valid_from')}{' '}
        {moment(currentUser.createdAt).format('MM-DD-YYYY')}
      </div>
    </div>
    <div className="ks-balance">
      {t('user_dashboard.card_detail.status')}: {currentUser._status}
      {currentUser.status === U_PENDING && (
        <div className="text-danger">
          <PendingUserWarningComponent currentUser={currentUser} />
        </div>
      )}
    </div>
    <Button className="btn btn-primary" onClick={logout}>
      {t('user_dashboard.card_detail.button.logout')}
    </Button>
  </div>
);

export default withTranslation('dashboard')(UserCardDetailsComponent);
