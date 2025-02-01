import React from 'react';
import { withTranslation } from '../i18n';
const PasswordCondition = ({ t }) => (
  <div className="text-muted">{t('rev_shared.message.password_recommend')}</div>
);

export default withTranslation('common')(PasswordCondition);
