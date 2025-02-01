import React from 'react';
import { AvatarComponent } from '@revtech/rev-shared/components';
import { withTranslation } from '@revtech/rev-shared/i18n';

const CardContentUserBillingComponent = ({ billItem = {}, t }) => {
  return (
    <div className="text-center">
      <AvatarComponent big url={billItem.coin.logo} />
      <h4 className="font-weight-normal">
        {t('recent_billings.card.label.owner')}: {billItem.owner.fullName}
      </h4>
      <span className="badge badge-default">
        {t('recent_billings.card.label.bill_id')}: {billItem.id}
      </span>
    </div>
  );
};

export default withTranslation('dashboard')(CardContentUserBillingComponent);
