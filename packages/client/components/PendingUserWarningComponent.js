import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';

const PendingUserWarningComponent = ({ currentUser, t }) => (
  <div>
    <span className="card-text text-danger">
      {t('user_dashboard.pending_warning.verified_yet')}
      <br />
      {`${t('user_dashboard.pending_warning.please_go_to')} `}
      <a
        href={`https://submitkyc.dirolabs.com/${currentUser.mccCode}/${currentUser.phone}`}
      >
        {t('user_dashboard.pending_warning.diro')}
      </a>{' '}
      {t('user_dashboard.pending_warning.submit_document')}
    </span>
  </div>
);

export default withTranslation('dashboard')(PendingUserWarningComponent);
