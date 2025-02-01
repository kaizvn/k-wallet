import { connect } from 'react-redux';
import React from 'react';

const InvoicingItemComponent = ({ invoice, index }) => (
  <tr key={index}>
    <td className="ks-text-light" width="1">
      {invoice.id}
    </td>
    <td className={`${invoice.nameClass}`}>{invoice.name}</td>
    <td className="ks-text-light">{invoice.scChanel}</td>
    <td className="ks-text-right">
      <span className={`badge ${invoice.stateClass}`}>{invoice.state}</span>
    </td>
    <td width="1">{invoice.amount}</td>
  </tr>
);
const connectToRedux = connect(() => ({
  invoices: [
    {
      id: '00451',
      name: 'Design Works',
      nameClass: '',
      scChanel: 'Twitter',
      state: 'Delayed',
      stateClass: 'badge-cranberry',
      amount: '$2500.00'
    },
    {
      id: '00452',
      name: 'Illustrations',
      nameClass: 'ks-text-bold',
      scChanel: 'Twitter',
      state: 'Pending',
      stateClass: 'badge-crusta',
      amount: '$460.00'
    },
    {
      id: '00453',
      name: 'UX Study',
      nameClass: 'ks-text-bold',
      scChanel: 'Twitter',
      state: 'Paid',
      stateClass: 'badge-mantis',
      amount: '$1280.00'
    },
    {
      id: '00454',
      name: 'UX Study',
      nameClass: 'ks-text-bold',
      scChanel: 'Twitter',
      state: 'Out',
      stateClass: 'badge-default',
      amount: '$1280.00'
    },
    {
      id: '00455',
      name: 'Design Support',
      nameClass: 'ks-text-bold',
      scChanel: 'Twitter',
      state: 'Out',
      stateClass: 'badge-default',
      amount: '$350.00'
    }
  ]
}));

class InvoicingTableComponent extends React.Component {
  render() {
    const props = this.props;
    return (
      <table className="table ks-payment-table-invoicing">
        <tbody>
          {props.invoices.map((invoice, index) => (
            <InvoicingItemComponent key={index} invoice={invoice} />
          ))}
        </tbody>
      </table>
    );
  }
}
export default connectToRedux(InvoicingTableComponent);
