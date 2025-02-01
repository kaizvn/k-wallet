import { connect } from 'react-redux';
import React from 'react';

const RecentActivitiesItemComponent = ({ invoice, index }) => (
  <tr>
    <td>{index}</td>
    <td>{invoice.subName}</td>
    <td>{invoice.startDate}</td>
    <td>{invoice.dueDate}</td>
    <td>
      <span className={`badge ${invoice.statusClass}`}>{invoice.status}</span>
    </td>
  </tr>
);
const connectToRedux = connect(() => ({
  invoices: [
    {
      subName: 'English - Paper 1',
      startDate: 'March 17, 2017',
      dueDate: 'March 28, 2017',
      status: 'Delayed',
      statusClass: 'badge-cranberry'
    },
    {
      subName: 'English - Paper 1',
      startDate: 'March 17, 2017',
      dueDate: 'March 28, 2017',
      status: 'Pending',
      statusClass: 'badge-crusta'
    },
    {
      subName: 'English - Paper 1',
      startDate: 'March 17, 2017',
      dueDate: 'March 28, 2017',
      status: 'Completed',
      statusClass: 'badge-success'
    },
    {
      subName: 'English - Paper 1',
      startDate: 'March 17, 2017',
      dueDate: 'March 28, 2017',
      status: 'Pending',
      statusClass: 'badge-crusta'
    },
    {
      subName: 'English - Paper 1',
      startDate: 'March 17, 2017',
      dueDate: 'March 28, 2017',
      status: 'Completed',
      statusClass: 'badge-success'
    }
  ]
}));

class RecentActivitiesTableComponent extends React.Component {
  render() {
    const props = this.props;
    return (
      <table className="table ks-payment-table-invoicing">
        <tbody>
          <tr>
            <th width="1">#</th>
            <th>Subject Name</th>
            <th>Start Date</th>
            <th>Due Date</th>
            <th width="1">Status</th>
          </tr>
          {props.invoices.map((invoice, index) => (
            <RecentActivitiesItemComponent
              index={++index}
              invoice={invoice}
              key={index}
            />
          ))}
        </tbody>
      </table>
    );
  }
}
export default connectToRedux(RecentActivitiesTableComponent);
