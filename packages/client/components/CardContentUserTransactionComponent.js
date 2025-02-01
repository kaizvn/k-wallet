import { DATE_TIME_FORMAT, COINTYPES } from '@revtech/rev-shared/utils';
import {
  DisplayCoinLogoComponent,
  TransactionStatusComponent
} from '@revtech/rev-shared/components';
import { Theme } from '@revtech/rev-shared/layouts';
import { withTranslation } from '@revtech/rev-shared/i18n';
import Moment from 'react-moment';
import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import UserTransactionComponent from './UserTransactionComponent';
import UserPaymentComponent from './UserPaymentComponent';
import { TRANSACTION_TYPES } from '@revtech/rev-shared/enums';
const { TRANSACTION_TRANSFER } = TRANSACTION_TYPES;
const { BTC, ETH } = COINTYPES;

const { ThemeConsumer } = Theme;

const TargetPaymentComponent = ({ transItem, userId }) =>
  transItem.type === TRANSACTION_TRANSFER ? (
    <UserTransactionComponent transItem={transItem} userId={userId} />
  ) : (
    <UserPaymentComponent transItem={transItem} />
  );

const CardContentUserTransactionComponent = ({ transItem, userId, t }) => {
  const isPaidTx = transItem.from && userId === transItem.from.id;
  return (
    <ThemeConsumer>
      {theme => (
        <React.Fragment>
          <div className="d-flex">
            <div className="col ks-text-light ks-text">
              <span className="font-weight-bold">
                {t('recent_transactions.card.label.payment_time')}:
              </span>{' '}
              <Moment format={DATE_TIME_FORMAT}>
                {new Date(transItem.createdAt)}
              </Moment>
            </div>

            {transItem.hash && (
              <a
                href={transItem.hashUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-right hover-to-show-link mr-4">
                  {transItem.coin && transItem.coin.symbol === ETH && (
                    <span className="hover-to-show">
                      {t('recent_transactions.hover.eth')}
                    </span>
                  )}
                  {transItem.coin && transItem.coin.symbol === BTC && (
                    <span className="hover-to-show">
                      {t('recent_transactions.hover.btc')}
                    </span>
                  )}
                  <FontAwesomeIcon icon={['fas', 'external-link-alt']} />
                </span>
              </a>
            )}
            <style jsx>
              {`
                .hover-to-show {
                  opacity: 0;
                  transition: all 0.2s ease-in-out;
                  position: absolute;
                  right: 72px;
                  z-index: 1;
                  border: solid 1px #c4cbe1;
                  border-radius: 12px;
                  padding: 6px;
                  color: #ffffff;
                  background-color: ${theme.primaryColor};
                }

                .hover-to-show-link:hover .hover-to-show {
                  opacity: 1;
                  transition: all 0.2s ease-in-out;
                }
              `}
            </style>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div className="col d-flex flex-row align-items-center">
              <DisplayCoinLogoComponent coin={transItem.coin} medium />
              <div className="d-flex flex-column ml-2">
                <span className="text-capitalize font-weight-bold ml-1">
                  {transItem.coin.name}
                </span>
                <TransactionStatusComponent status={transItem.status} t={t} />
              </div>
            </div>
            <div className="d-flex flex-column font-weight-bold justify-content-end mr-4">
              <span>
                {isPaidTx ? '-' + transItem.amount : transItem.amount}
              </span>
              <span className="text-right">{transItem.coin.symbol}</span>
            </div>
          </div>

          <div className="row text-center">
            <div className="col-md-12">
              <TargetPaymentComponent transItem={transItem} userId={userId} />
            </div>
          </div>
        </React.Fragment>
      )}
    </ThemeConsumer>
  );
};

export default withTranslation(['dashboard', 'common'])(
  CardContentUserTransactionComponent
);
