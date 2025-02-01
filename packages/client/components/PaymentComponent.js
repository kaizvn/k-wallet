import { Button, RLink } from '@revtech/rev-shared/layouts';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import {
  DropdownComponent,
  FrameComponent,
  FrameHeaderComponent,
  PaymentStatusComponent
} from '@revtech/rev-shared/components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { getParentPath } from '@revtech/rev-shared/libs';
import Moment from 'react-moment';
import React from 'react';
import Router from 'next/router';

import { getAllPayments } from '@revtech/rev-shared/apis/actions';
import { allPaymentsSelector } from '@revtech/rev-shared/apis/selectors';

const connectToRedux = connect(
  createStructuredSelector({
    payments: allPaymentsSelector
  }),
  dispatch => ({
    getAllPayments: () => {
      dispatch(getAllPayments());
    }
  })
);

const DisplayOwnerComponent = ({ owner = {} }) => (
  <span>
    {owner.address ? (
      <a
        target="_blank" // eslint-disable-line
        href={`https://ropsten.etherscan.io/address/${owner.address}`}
      >
        {owner.address}
      </a>
    ) : (
      owner.name || owner.fullName || ''
    )}
  </span>
);

const PaymentsItemComponent = ({ paysItem, index }) => (
  <tr>
    <td>{index + 1}</td>
    <td>{paysItem.order.id}</td>
    <td>{paysItem.trackingId}</td>
    <td className="sc-text-wordwrap">
      <a
        href={`https://ropsten.etherscan.io/tx/${paysItem.transactionHash}`}
        target="_blank" // eslint-disable-line
      >
        {paysItem.transactionHash}
      </a>
    </td>
    <td>{paysItem.amount}</td>
    <td>{paysItem.coin.symbol}</td>
    <td className="sc-text-wordwrap">
      <DisplayOwnerComponent owner={paysItem.from} />
    </td>
    <td className="sc-text-wordwrap">
      <DisplayOwnerComponent owner={paysItem.to} />
    </td>
    <td>
      <PaymentStatusComponent status={paysItem.status} />
    </td>
    <td>
      <Moment format={DATE_TIME_FORMAT}>{new Date(paysItem.createdAt)}</Moment>
    </td>
    <td>
      <DropdownComponent items={[{ label: '', action: () => undefined }]} />
    </td>
  </tr>
);

class PaymentComponent extends React.Component {
  componentWillMount() {
    this.props.getAllPayments();
  }
  render() {
    const { payments } = this.props;
    return (
      <FrameComponent>
        <FrameHeaderComponent title="Payments">
          <div className="row">
            <div className="col-md-6 mb-1">
              <RLink href={getParentPath(Router.router.pathname) + '/deposit'}>
                <Button>Deposit</Button>
              </RLink>
            </div>
            <div className="col-md-6">
              <RLink
                href={getParentPath(Router.router.pathname) + '/withdrawal'}
              >
                <Button>Withdraw</Button>
              </RLink>
            </div>
          </div>
        </FrameHeaderComponent>
        <div
          className="card-block ks-datatable table-responsive"
          data-spy="scroll"
        >
          <table
            id="ks-sales-datatable"
            className="table table-bordered"
            width="100%"
          >
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Tracking ID</th>
                <th>Transaction</th>
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
              {payments &&
                payments.map((item, index) => (
                  <PaymentsItemComponent
                    key={index}
                    index={index}
                    paysItem={item}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </FrameComponent>
    );
  }
}

export default connectToRedux(PaymentComponent);
