import React from 'react';

class CardHeaderUserPaymentComponent extends React.Component {
  render() {
    const { transItem, userId } = this.props;
    const isPaidTx = transItem.from && userId === transItem.from.id;

    return (
      <React.Fragment>
        {isPaidTx ? (
          <h5 className="card ks-widget-payment-price-ratio ks-purple p-3 rounded-0">
            {transItem.type && transItem.type.toUpperCase()}
          </h5>
        ) : (
          <h5 className="card ks-widget-payment-price-ratio ks-green p-3 rounded-0">
            {transItem.type && transItem.type.toUpperCase()}
          </h5>
        )}
      </React.Fragment>
    );
  }
}
export default CardHeaderUserPaymentComponent;
