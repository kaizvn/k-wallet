import { BillStatusComponent } from '@revtech/rev-shared/components';
import { DATE_TIME_FORMAT } from '@revtech/rev-shared/utils';
import { copyToClipboard } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';

const RowBillComponent = ({ title, children }) => (
  <div className="row align-items-center">
    <div className="col-md-3 mb-1 mb-md-0">{title}:</div>
    <div className="col-md-9">{children}</div>
  </div>
);

const CardFooterUserBillingComponent = ({ billItem = {}, t }) => {
  return (
    <div className="card border-0 p-3 rounded-0">
      <RowBillComponent title={t('recent_billings.card.label.tracking_id')}>
        {billItem.trackingId}
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.address')}>
        <span className="font-weight-bold">
          {billItem.address}
          <a
            className="ml-1 copy"
            onClick={() => {
              copyToClipboard(billItem.address);
            }}
          >
            <i className="ml-1 icon icon-copy" />
          </a>
        </span>
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.status')}>
        <BillStatusComponent status={billItem.status} t={t} />
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.date_created')}>
        <i className="mr-1 icon icon-time" />
        <Moment format={DATE_TIME_FORMAT}>
          {new Date(billItem.createdAt)}
        </Moment>
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.date_updated')}>
        <i className="mr-1 icon icon-time" />
        <Moment format={DATE_TIME_FORMAT}>
          {new Date(billItem.updatedAt)}
        </Moment>
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.amount')}>
        {billItem.amount} <small>{billItem.coin.symbol}</small>
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.transaction_fee')}>
        {billItem.fee} <small>{billItem.coin.symbol}</small>
      </RowBillComponent>
      <hr className="hr-space" />
      <RowBillComponent title={t('recent_billings.card.label.actual_amount')}>
        {billItem.actualAmount} <small>{billItem.coin.symbol}</small>
      </RowBillComponent>
      <hr className="hr-space" />

      <style jsx>{`
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
      `}</style>
    </div>
  );
};
export default withTranslation(['dashboard', 'common'])(
  CardFooterUserBillingComponent
);
