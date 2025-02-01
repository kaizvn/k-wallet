import { Button } from '@revtech/rev-shared/layouts';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import cx from 'classnames';

import {
  GetTransactionsListSelector,
  getTransactionsList
} from '../stores/PartnerState';
import {
  setOrderDeliveredByUser,
  setOrderRevertedByUser
} from '../stores/OrdersState';

const connectToRedux = connect(
  createStructuredSelector({
    transactions: GetTransactionsListSelector
  }),
  dispatch => ({
    getTransactionsList: () => dispatch(getTransactionsList()),
    setDoneOrdered: id => dispatch(setOrderDeliveredByUser(id)),
    setDoneReverted: id => dispatch(setOrderRevertedByUser(id))
  })
);
const TransactionsFromOwnerDataComponent = ({ transItemFrom }) => (
  <span>{transItemFrom.name || transItemFrom.fullName}</span>
);

class OrderListComponent extends React.Component {
  componentWillMount() {
    this.props.getTransactionsList();
  }
  render() {
    const { transactions, setDoneOrdered, setDoneReverted } = this.props;

    return (
      <div className="card-block ks-datatable table-responsive">
        <div className="row">
          {transactions &&
            transactions
              .filter(item => item.description !== null)
              .map((item, index) => (
                <div className="col-lg-3 mb-3" key={index}>
                  <div
                    className={cx({
                      'card card-outline-success ': item.isDelivered === 1,
                      'card card-outline-danger ': item.isDelivered !== 1
                    })}
                  >
                    <div
                      className={cx({
                        'card-header bg-success ': item.isDelivered === 1,
                        'card-header bg-danger  ': item.isDelivered !== 1
                      })}
                    >
                      <strong>#Order {index + 1}</strong>
                    </div>
                    <div className="card-block">
                      <blockquote className="card-blockquote">
                        <p>
                          Order <strong>{item.description}</strong>
                        </p>
                        <footer>
                          Order by <cite title="Source Title" />{' '}
                          <strong>
                            <TransactionsFromOwnerDataComponent
                              transItemFrom={item.from}
                            />
                          </strong>
                          <span> at {item.createdAt}</span>
                        </footer>
                      </blockquote>
                      <React.Fragment>
                        {item.isDelivered !== 1 && (
                          <div className="col-md-12">
                            <Button onClick={() => setDoneOrdered(item.id)}>
                              Delivery
                            </Button>
                          </div>
                        )}
                        {item.isDelivered === 1 && (
                          <Button onClick={() => setDoneReverted(item.id)}>
                            Revert
                          </Button>
                        )}
                      </React.Fragment>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <style jsx>{`
          .card-block {
            min-height: 150px;
          }
        `}</style>
      </div>
    );
  }
}
export default connectToRedux(OrderListComponent);
