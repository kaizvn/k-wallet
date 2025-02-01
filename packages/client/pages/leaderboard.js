import React from 'react';
import { connect } from 'react-redux';
import { EmptyPageLayout } from '@revtech/rev-shared/layouts';

const CertificateComponent = () => <i className="la la-certificate" />;

const ItemLeadComponent = ({ item, index }) => (
  <tr>
    <td className="text-center" width={1}>
      {index < 3 ? <CertificateComponent /> : '_'}
    </td>
    <td className="lead-rank">
      <span>{index + 1}</span>
    </td>
    <td className="lead-user">
      <p>{item.name}</p>
      <div className="line" style={{ width: `${item.percent}%` }} />
    </td>
    <td className="lead-point">{item.point}</td>
  </tr>
);
const connectToRedux = connect(() => ({
  lastLead: {
    name: 'Jack',
    percent: '95',
    point: 4123,
    currency: 'USD',
    created_at: '10:25:01 Mar,23 2019'
  },

  leads: [
    {
      name: 'Smith',
      percent: '100',
      point: 5234,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Jack',
      percent: '95',
      point: 4123,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '80',
      point: 3321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Tarek',
      percent: '70',
      point: 3321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '40',
      point: 2121,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '60',
      point: 2321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Jack',
      percent: '95',
      point: 4123,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '80',
      point: 3321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Tarek',
      percent: '70',
      point: 3021,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '40',
      point: 2321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '60',
      point: 2821,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Jack',
      percent: '95',
      point: 4123,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '80',
      point: 3321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Tarek',
      percent: '10',
      point: 1321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '30',
      point: 2321,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    },
    {
      name: 'Kalaji',
      percent: '60',
      point: 3021,
      currency: 'USD',
      created_at: '10:25:01 Mar,23 2019'
    }
  ]
}));

class LeaderBoardPage extends React.Component {
  render() {
    const props = this.props;
    return (
      <EmptyPageLayout>
        <link
          rel="stylesheet"
          type="text/css"
          href="/static/customs/leaderboard.css"
        />
        <div className="sc-leaderboard">
          <div className="circle-group" />
          <div className="sc-mainboard">
            <div className="container">
              <div className="title-group">
                <h1 className="title">Leader Board</h1>
                <p className="date">{new Date().toLocaleString()}</p>
              </div>
              <div className="text-animation">
                <h3>
                  The last donation is by {props.lastLead.name} at{' '}
                  {props.lastLead.created_at} | The total value is worth{' '}
                  {props.lastLead.currency} {props.lastLead.point}
                </h3>
              </div>
              <div style={{ overflowX: 'auto', height: '80vh' }}>
                <table className="table">
                  <thead className="table-fixed">
                    <tr>
                      <th scope="col" className="text-center">
                        #
                      </th>
                      <th scope="col">#</th>
                      <th scope="col">Name</th>
                      <th scope="col">Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.leads.map((item, index) => (
                      <ItemLeadComponent
                        key={index}
                        index={index}
                        item={item}
                      />
                    ))}
                  </tbody>
                </table>
                <div className="pagination" />
              </div>
            </div>
          </div>
        </div>
      </EmptyPageLayout>
    );
  }
}
export default connectToRedux(LeaderBoardPage);
