import { connect } from 'react-redux';
import React from 'react';
import Router from 'next/router';
import Select from 'react-select';
import { pick } from 'lodash/fp';
import { compose } from 'redux';

import { getbackUrl } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, InputText, RLink } from '@revtech/rev-shared/layouts';
import {
  FrameComponent,
  FrameHeaderComponent
} from '@revtech/rev-shared/components';
const connectToRedux = connect(
  pick(['paymentCoinInfo', 'availableWithdrawal', 'transactionFee']),
  null
);

const enhance = compose(
  connectToRedux,
  withTranslation('transaction')
);

const TransferHeaderComponent = ({ t }) => (
  <ul className="mt-3 mr-3">
    <li>
      <span className="ks-text">
        {t('transfer.header.note_text.note_one').toUpperCase()}
      </span>
    </li>
    <li>
      <span className="ks-text">{t('transfer.header.note_text.note_two')}</span>
    </li>
  </ul>
);

const TransferInstruction = ({ t }) => (
  <React.Fragment>
    <h6 className="ml-4 mt-2">
      <span className="ks-text">{t('transfer.instruction.title')}</span>
    </h6>
    <ul className="mr-4">
      <li>{t('transfer.instruction.note_text.note_one')}</li>
      <li>{t('transfer.instruction.note_text.note_two')}</li>
    </ul>
  </React.Fragment>
);

const TransferComponent = ({
  paymentCoinInfo,
  availableWithdrawal,
  transactionFee,
  t
}) => {
  const transferInputOptions = [
    {
      label: t('transfer.option.label.username'),
      value: 'username'
    },
    {
      label: t('transfer.option.label.address'),
      value: 'address'
    },
    {
      label: t('transfer.option.label.partner_id'),
      value: 'partnerId'
    }
  ];
  return (
    <div className="row">
      <div className="col-md-12">
        <FrameComponent>
          <FrameHeaderComponent title={t('transfer.title')} />
          <TransferHeaderComponent t={t} />
          <h2 className="ml-4 mt-2">
            <span className="ks-text">{`${paymentCoinInfo.name} (${paymentCoinInfo.id})`}</span>
          </h2>
          <hr className="ml-4 mr-4" />
          <TransferInstruction t={t} />
          <hr className="ml-4 mr-4" />
          <h5 className="ml-4 mt-2">
            <span className="ks-text">{t('transfer.recipient.title')}</span>
          </h5>
          <span className="ks-text ml-4 mb-2">
            {t('transfer.recipient.content')}
          </span>
          <div className="form-group row m-2">
            <div className="col-md-4 mb-2">
              <Select options={transferInputOptions} />
            </div>
            <div className="col-md-8">
              <InputText className="form-control" onChange={() => {}} />
            </div>
          </div>

          <h5 className="ml-4 mt-2">
            <span className="ks-text">
              {t('transfer.label.transfer_amount')}
            </span>
          </h5>
          <span className="ks-text ml-4 mb-2">
            {t('transfer.label.available')}:{' '}
            {`${availableWithdrawal} ${paymentCoinInfo.id}`}
          </span>
          <div className="form-group row m-2">
            <div className="col-md-12">
              <InputText className="form-control" onChange={() => {}} />
            </div>
          </div>
          <div className="row m-2">
            <div className="col-md-8" />
            <div className="col-md-4 mb-2 mt-2">
              <span className="ks-text ml-4 ">
                {`${t('transfer.label.transaction_fee')}: `}
                {`${transactionFee} ${paymentCoinInfo.id}`}
              </span>
            </div>
            <div className="col-md-8" />
            <div className="col-md-4 mb-2">
              <span className="ks-text ml-4">
                {`${t('transfer.label.total_withdrawal')}: `}
                {`${transactionFee} ${paymentCoinInfo.id}`}
              </span>
            </div>
            <div className="col-md-9" />
            <div className="col-md-2 mb-2">
              <RLink href={getbackUrl(Router.router.pathname, 'transactions')}>
                <Button>{t('transfer.button.back')}</Button>
              </RLink>
            </div>
          </div>
        </FrameComponent>
      </div>
    </div>
  );
};
export default enhance(TransferComponent);
