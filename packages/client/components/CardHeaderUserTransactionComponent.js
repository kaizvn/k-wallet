import React from 'react';
import { withTranslation } from '@revtech/rev-shared/i18n';
class CardHeaderUserTransactionComponent extends React.Component {
  render() {
    const { transItem, userId, t } = this.props;
    const isPaidTx = transItem.from && userId === transItem.from.id;
    const txInfo = {
      currency: transItem.coin ? transItem.coin.symbol : '',
      type: isPaidTx
        ? t('recent_transactions.card.title.paid')
        : t('recent_transactions.card.title.received')
    };
    return (
      <React.Fragment>
        {isPaidTx ? (
          <h5 className="card ks-widget-payment-price-ratio ks-purple p-3 rounded-0">
            {txInfo.type && txInfo.type.toUpperCase()}
          </h5>
        ) : (
          <h5 className="card ks-widget-payment-price-ratio ks-green p-3 rounded-0">
            {txInfo.type && txInfo.type.toUpperCase()}
          </h5>
        )}
      </React.Fragment>
    );
  }
}
export default withTranslation('dashboard')(CardHeaderUserTransactionComponent);
