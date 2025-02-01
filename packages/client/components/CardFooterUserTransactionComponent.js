import React from 'react';
import Link from 'next/link';
import { createLink } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
class CardFooterUserTransactionComponent extends React.Component {
  render() {
    const { transItem, t } = this.props;
    return (
      <div className="d-flex justify-content-end p-4">
        <Link
          href={createLink(['user', `transaction-detail?id=${transItem.id}`])}
        >
          <span className="btn btn-info ks-light">
            {t('recent_transactions.card.button.view_detail')}
            <span className="la la-arrow-circle-o-right ks-color-light" />
          </span>
        </Link>
      </div>
    );
  }
}
export default withTranslation('dashboard')(CardFooterUserTransactionComponent);
