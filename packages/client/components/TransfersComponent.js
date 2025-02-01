import React from 'react';

const Transfers = () => (
  <div className="ks-page-container">
    <div className="ks-column ks-page">
      <div className="ks-page-header">
        <section className="ks-title">
          <h3>Transfers</h3>
        </section>
      </div>
      <div className="ks-page-content">
        <div className="ks-page-content-body ks-content-nav">
          <div className="ks-nav-body">
            <div className="ks-nav-body-wrapper">
              <div className="container-fluid">
                <div className="table-responsive" data-spy="scroll">
                  <table
                    id="ks-datatable"
                    className="table table-bordered"
                    width="100%"
                  >
                    <thead>
                      <tr>
                        <th rowSpan="2">#</th>
                        <th>ID</th>
                        <th>Wallet ID</th>
                        <th>Type</th>
                        <th>Transactions</th>
                        <th>Source amount</th>
                        <th>Source currency</th>
                        <th>Target amount</th>
                        <th>Target currency</th>
                        <th>Status</th>
                        <th>Transfer date</th>
                        <th>Actions</th>
                      </tr>
                      <tr>
                        <th>
                          <input
                            type="text"
                            id="id-input"
                            className="filter-input-value"
                          />
                        </th>
                        <th>
                          <input
                            type="text"
                            id="name-input"
                            className="filter-input-value"
                          />
                        </th>
                        <th>
                          <select className="form-control filter-input-value">
                            <option />
                            <option>Deposit</option>
                          </select>
                        </th>
                        <th />
                        <th>
                          <input
                            type="text"
                            id="source-amount-input"
                            className="filter-input-value"
                          />
                        </th>
                        <th>
                          <select
                            className="form-control filter-input-value"
                            name="source-currency"
                          >
                            <option />
                            <option>BTC</option>
                          </select>
                        </th>
                        <th>
                          <input
                            type="text"
                            id="tartget-amount-input"
                            className="filter-input-value"
                          />
                        </th>
                        <th>
                          <select
                            className="form-control filter-input-value"
                            name="target-currency"
                          >
                            <option />
                            <option>USD</option>
                            <option>JP</option>
                          </select>
                        </th>
                        <th>
                          <select
                            className="form-control filter-input-value"
                            name="target-currency"
                          >
                            <option />
                            <option>Sent</option>
                          </select>
                        </th>
                        <th>
                          <input
                            type="text"
                            id="transfer-date-input"
                            className="filter-input-value"
                          />
                        </th>
                        <th />
                      </tr>
                    </thead>
                    <tfoot>
                      <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Tracking ID</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Transactions</th>
                        <th>Amount</th>
                        <th>Actual amount</th>
                        <th>Currency</th>
                        <th>Created</th>
                        <th>Expired</th>
                        <th>Actions</th>
                      </tr>
                    </tfoot>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>1422</td>
                        <td>15</td>
                        <td className="sc-text-wordwrap">
                          Deposit from blockchain
                        </td>
                        <td className="sc-text-wordwrap">
                          cmalwmmu930oc98fw89c8820kmdnhcjkpls90rityfhgv43565768
                        </td>
                        <td>0.0009</td>
                        <td>BTC</td>
                        <td>3.33</td>
                        <td>USD</td>
                        <td>Sent</td>
                        <td>3/6/20, 10:10 AM</td>
                        <td align="center">
                          <a href="">
                            <span className="ks-icon la la-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>1422</td>
                        <td>15</td>
                        <td className="sc-text-wordwrap">
                          Deposit from blockchain
                        </td>
                        <td className="sc-text-wordwrap">
                          cmalwmmu930oc98fw89c8820kmdnhcjkpls90rityfhgv43565768
                        </td>
                        <td>0.0009</td>
                        <td>BTC</td>
                        <td>3.33</td>
                        <td>USD</td>
                        <td>Sent</td>
                        <td>3/6/20, 10:10 AM</td>
                        <td align="center">
                          <a href="">
                            <span className="ks-icon la la-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>3</td>
                        <td>1422</td>
                        <td>15</td>
                        <td className="sc-text-wordwrap">
                          Deposit from blockchain
                        </td>
                        <td className="sc-text-wordwrap">
                          cmalwmmu930oc98fw89c8820kmdnhcjkpls90rityfhgv43565768
                        </td>
                        <td>0.0009</td>
                        <td>BTC</td>
                        <td>3.33</td>
                        <td>USD</td>
                        <td>Sent</td>
                        <td>3/6/20, 10:10 AM</td>
                        <td align="center">
                          <a href="">
                            <span className="ks-icon la la-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>1422</td>
                        <td>15</td>
                        <td className="sc-text-wordwrap">
                          Deposit from blockchain
                        </td>
                        <td className="sc-text-wordwrap">
                          cmalwmmu930oc98fw89c8820kmdnhcjkpls90rityfhgv43565768
                        </td>
                        <td>0.0009</td>
                        <td>BTC</td>
                        <td>3.33</td>
                        <td>USD</td>
                        <td>Sent</td>
                        <td>3/6/20, 10:10 AM</td>
                        <td align="center">
                          <a href="">
                            <span className="ks-icon la la-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>4</td>
                        <td>1422</td>
                        <td>15</td>
                        <td className="sc-text-wordwrap">
                          Deposit from blockchain
                        </td>
                        <td className="sc-text-wordwrap">
                          cmalwmmu930oc98fw89c8820kmdnhcjkpls90rityfhgv43565768
                        </td>
                        <td>0.0009</td>
                        <td>BTC</td>
                        <td>3.33</td>
                        <td>USD</td>
                        <td>Sent</td>
                        <td>3/6/20, 10:10 AM</td>
                        <td align="center">
                          <a href="">
                            <span className="ks-icon la la-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td>5</td>
                        <td>1422</td>
                        <td>15</td>
                        <td className="sc-text-wordwrap">
                          Deposit from blockchain
                        </td>
                        <td className="sc-text-wordwrap">
                          cmalwmmu930oc98fw89c8820kmdnhcjkpls90rityfhgv43565768
                        </td>
                        <td>0.0009</td>
                        <td>BTC</td>
                        <td>3.33</td>
                        <td>USD</td>
                        <td>Sent</td>
                        <td>3/6/20, 10:10 AM</td>
                        <td align="center">
                          <a href="">
                            <span className="ks-icon la la-eye" />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
export default Transfers;
