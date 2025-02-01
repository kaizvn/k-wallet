import { connect } from 'react-redux';
import React from 'react';

const GlobalSalesItemComponent = ({ item, index }) => (
  <tr key={index}>
    <td className="ks-flag" width="20">
      <img alt="" src={`/static/kosmo/assets/img/flags/24/${item.flag}`} />
    </td>
    <td>{item.name}</td>
    <td className="text-right">{item.amount}</td>
    <td className="ks-amount">{item.percent}</td>
  </tr>
);
const connectToRedux = connect(() => ({
  locations: [
    {
      flag: 'United-States.png',
      name: 'The USA',
      amount: '2.910',
      percent: '53.23%'
    },
    {
      flag: 'United-Kingdom.png',
      name: 'UK',
      amount: '1.300',
      percent: '20.43%'
    },
    {
      flag: 'Canada.png',
      name: 'Canada',
      amount: '760',
      percent: '10.35%'
    },
    {
      flag: 'France.png',
      name: 'France',
      amount: '600',
      percent: '6.47%'
    },
    {
      flag: 'Germany.png',
      name: 'Germany',
      amount: '530',
      percent: '4.91%'
    },
    {
      flag: 'Spain.png',
      name: 'Spain',
      amount: '322',
      percent: '2.01%'
    },
    {
      flag: 'Russia.png',
      name: 'Russia',
      amount: '210',
      percent: '0.66%'
    }
  ]
}));

class GlobalSalesTableComponent extends React.Component {
  render() {
    const props = this.props;
    return (
      <div className="row">
        <div className="col-lg-5">
          <table className="table ks-payment-widget-table-and-map-table">
            <tbody>
              {props.locations.map((item, index) => (
                <GlobalSalesItemComponent key={index} item={item} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-lg-7">
          <div id="ks-payment-widget-table-and-map-map" data-height="284" />
        </div>
      </div>
    );
  }
}
export default connectToRedux(GlobalSalesTableComponent);
