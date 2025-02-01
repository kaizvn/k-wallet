import Moment from 'react-moment';
import React from 'react';

import { DATE_TIME_FORMAT } from '../utils';
import { copyToClipboard } from '../libs';
import { withTranslation } from '../i18n';
import AvatarComponent from './AvatarComponent';
import BillStatusComponent from './BillStatusComponent';
import BillTypesComponent from './BillTypesComponent';
import EmptyDataComponent from './EmptyDataComponent';

const RowBillComponent = ({ title, children }) => (
  <div className="row align-items-center">
    <div className="col-md-3 mb-1 mb-md-0">{title}:</div>
    <div className="col-md-9">{children}</div>
  </div>
);

const BillDetailsCardComponent = ({ bill, t }) => (
  <div>
    {bill ? (
      <div className="card shadow border-0 p-3 rounded-0 mt-3">
        <RowBillComponent title={t('rev_shared.billing_card.label.id')}>
          <span className="font-weight-bold">
            {bill.id}
            <a
              className="ml-1 copy"
              onClick={() => {
                copyToClipboard(bill.id);
              }}
            >
              <i className="ml-1 icon icon-copy" />
            </a>
          </span>
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent title={t('rev_shared.billing_card.label.bill_type')}>
          <BillTypesComponent type={bill.type} t={t} />
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent title={t('rev_shared.billing_card.label.owner_name')}>
          {bill.owner.name || bill.owner.fullName || bill.owner.address}
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent title={t('rev_shared.billing_card.label.currency')}>
          <AvatarComponent small url={bill.coin.logo} /> {bill.coin.symbol}
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent
          title={t('rev_shared.billing_card.label.tracking_id')}
        >
          {bill.trackingId}
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent title={t('rev_shared.billing_card.label.address')}>
          <span className="font-weight-bold">
            {bill.address}
            <a
              className="ml-1 copy"
              onClick={() => {
                copyToClipboard(bill.address);
              }}
            >
              <i className="ml-1 icon icon-copy" />
            </a>
          </span>
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent title={t('rev_shared.billing_card.label.status')}>
          <BillStatusComponent status={bill.status} t={t} />
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent
          title={t('rev_shared.billing_card.label.date_created')}
        >
          <i className="mr-1 icon icon-time" />
          <Moment format={DATE_TIME_FORMAT}>{new Date(bill.createdAt)}</Moment>
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent
          title={t('rev_shared.billing_card.label.date_updated')}
        >
          <i className="mr-1 icon icon-time" />
          <Moment format={DATE_TIME_FORMAT}>{new Date(bill.updatedAt)}</Moment>
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent title={t('rev_shared.billing_card.label.amount')}>
          {bill.amount} <small>{bill.coin.symbol}</small>
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent
          title={t('rev_shared.billing_card.label.transaction_fee')}
        >
          {bill.fee} <small>{bill.coin.symbol}</small>
        </RowBillComponent>
        <hr className="hr-space" />
        <RowBillComponent
          title={t('rev_shared.billing_card.label.actual_amount')}
        >
          {bill.actualAmount} <small>{bill.coin.symbol}</small>
        </RowBillComponent>
        <hr className="hr-space" />
      </div>
    ) : (
      <EmptyDataComponent message={t('rev_shared.message.empty_bill')} />
    )}
    <style jsx>{`
                .empty-bill {
                    display: flex;
                    flex: auto;
                    justify-content: center;
                }
                .shadow {
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1),
                    0 6px 6px rgba(0, 0, 0, 0.1);
                }
                .hr-space {
                    margin-top: 12px;
                    margin-bottom: 12px;
                    opacity: 0.75;
                  }
                  .icon-time:before {
                    content: '\f236';
                  }
                  .icon-copy:before {
                    content: '\f190';
                  }
                  .copy {
                    cursor: pointer;
                  }
                  .icon {
                    font: normal normal normal 16px/1 LineAwesome;
                    font-size: inherit;
                    text-decoration: inherit;
                    text-rendering: optimizeLegibility;
                    text-transform: none;
                    font-smoothing: antialiased;
                    display: inline-block;
                  }

                }
                `}</style>
  </div>
);

export default withTranslation('common')(BillDetailsCardComponent);
