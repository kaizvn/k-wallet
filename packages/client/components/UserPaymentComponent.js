import { withTranslation } from '@revtech/rev-shared/i18n';
import React from 'react';

const InfoBlockComponent = ({ label, info }) =>
  info ? (
    <div className="d-flex flex-column mb-1 flex-xs-column">
      <span className="text-left font-weight-bold ">{label}</span>
      <span className="text-left">{info}</span>
      <style jsx>
        {`
          @media (max-width: 576px) {
            .flex-xs-column {
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  ) : null;

const UserPaymentComponent = ({ transItem = {}, t }) => {
  const txTo = transItem.to;
  return (
    <div className="card-block">
      <InfoBlockComponent
        label={t('recent_transactions.card.label.receiver') + ':'}
        info={
          transItem.receivedAddress ||
          txTo.name ||
          txTo.fullName ||
          txTo.address
        }
      />
      <hr className="hr-space" />
      <InfoBlockComponent
        label={t('recent_transactions.card.label.hash') + ':'}
        info={
          transItem.hash && (
            <a
              href={transItem.hashUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-italic">{transItem.hash}</span>
            </a>
          )
        }
      />
      <style jsx>
        {`
          @media (max-width: 576px) {
            .card-block {
              padding: 30px 0;
            }
          }
          .hr-space {
            margin-top: 0.65rem;
            margin-bottom: 0.65rem;
            opacity: 0.75;
          }
        `}
      </style>
    </div>
  );
};

export default withTranslation('dashboard')(UserPaymentComponent);
