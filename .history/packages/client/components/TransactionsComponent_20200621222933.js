import { Button, RLink } from '@revtech/rev-shared/layouts';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import {
  FrameComponent,
  FrameHeaderComponent,
  TransactionStatusComponent
} from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getParentPath } from '@revtech/rev-shared/libs';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import {
  GetTransactionsListSelector,
  getTransactionsList
} from '../stores/PartnerState';

const connectToRedux = connect(
  createStructuredSelector({
    transactions: GetTransactionsListSelector
  }),
  dispatch => ({
    getTransactionsList: () => dispatch(getTransactionsList())
  })
);
const TransactionsFromOwnerDataComponent = ({ transItemFrom }) => (
  <span>{transItemFrom.name || transItemFrom.fullName}</span>
);
const TransactionsToOwnerDataComponent = ({ transItemTo }) => (
  <span>{transItemTo.name || transItemTo.fullName}</span>
);
const TransactionsItemComponent = ({ transItem, index, t }) => (
  <tr>
    <td>{index + 1}</td>
    <td>{transItem.id}</td>
    <td>{transItem.description}</td>
    <td>{transItem.amount}</td>
    <td>{transItem.coin.symbol}</td>
    <td className="sc-text-wordwrap">
      <TransactionsFromOwnerDataComponent transItemFrom={transItem.from} />
    </td>
    <td className="sc-text-wordwrap">
      <TransactionsToOwnerDataComponent transItemTo={transItem.to} />
    </td>
    <td>
      <TransactionStatusComponent t={t} status={transItem.status} />
    </td>
    <td>
      <Moment format={DATE_TIME_FORMAT}>{new Date(transItem.createdAt)}</Moment>
    </td>
    <td />
  </tr>
);

class TransactionsComponent extends React.Component {
  componentWillMount() {
    this.props.getTransactionsList();
  }
  render() {
    const { transactions, t } = this.props;
    return (
      <FrameComponent>
        <link
          rel="stylesheet"
          type="text/css"
          href="/static/kosmo/assets/styles/widgets/tables.min.css"
        />
        <FrameHeaderComponent title="Transactions">
          <RLink href={getParentPath(Router.router.pathname) + '/transfer'}>
            <Button>Transfer</Button>
          </RLink>
        </FrameHeaderComponent>
        <div className="card-block ks-datatable table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
                <th>Payment date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions &&
                transactions.map((item, index) => (
                  <TransactionsItemComponent
                    t={t}
                    key={index}
                    index={index}
                    transItem={item}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </FrameComponent>
    );
  }
}
export default connectToRedux(TransactionsComponent);
