import { Button, InputText, RLink } from '@revtech/rev-shared/layouts';
import {
  FrameComponent,
  FrameHeaderComponent
} from '@revtech/rev-shared/components';
import { OPTIONS } from '@revtech/rev-shared/utils';
import { connect } from 'react-redux';
import { getbackUrl } from '@revtech/rev-shared/libs';
import { pick } from 'lodash/fp';
import React from 'react';
import Router from 'next/router';
import Select from 'react-select';

const { transferInputOptions } = OPTIONS;

const connectToRedux = connect(
  pick(['paymentCoinInfo', 'availableWithdrawal', 'transactionFee']),
  null
);

const TransferHeaderComponent = () => (
  <ul className="mt-3 mr-3">
    <li>
      <span className="ks-text">
        {'Disclaimer: do not withdraw directly to a crowdfund or ico.'.toUpperCase()}{' '}
      </span>
    </li>
    <li>
      <span className="ks-text">
        We will not credit your account with tokens from that sale.
      </span>
    </li>
  </ul>
);

const TransferInstruction = () => (
  <React.Fragment>
    <h6 className="ml-4 mt-2">
      <span className="ks-text">Withdrawal Instruction</span>
    </h6>
    <ul className="mr-4">
      <li>In the withdrawal address field, we only support hex address.</li>
      <li>Do not use direct IBAN, indirect IBAN, or unique userid.</li>
    </ul>
  </React.Fragment>
);

const TransferComponent = ({
  paymentCoinInfo,
  availableWithdrawal,
  transactionFee
}) => (
  <div className="row">
    <div className="col-md-12">
      <FrameComponent>
        <FrameHeaderComponent title="Transfer" />
        <TransferHeaderComponent />
        <h2 className="ml-4 mt-2">
          <span className="ks-text">{`${paymentCoinInfo.name} (${paymentCoinInfo.id})`}</span>
        </h2>
        <hr className="ml-4 mr-4" />
        <TransferInstruction />
        <hr className="ml-4 mr-4" />
        <h5 className="ml-4 mt-2">
          <span className="ks-text">Recipient's information</span>
        </h5>
        <span className="ks-text ml-4 mb-2">
          Please verify the recipient’s account type to avoid making incorrect
          transfer.
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
          <span className="ks-text">Transfer Amount</span>
        </h5>
        <span className="ks-text ml-4 mb-2">
          Available: {`${availableWithdrawal} ${paymentCoinInfo.id}`}
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
              Transaction Fee: {`${transactionFee} ${paymentCoinInfo.id}`}
            </span>
          </div>
          <div className="col-md-8" />
          <div className="col-md-4 mb-2">
            <span className="ks-text ml-4">
              Total Withdrawal: {`${transactionFee} ${paymentCoinInfo.id}`}
            </span>
          </div>
          <div className="col-md-9" />
          <div className="col-md-2 mb-2">
            <RLink href={getbackUrl(Router.router.pathname, 'transactions')}>
              <Button>Back</Button>
            </RLink>
          </div>
        </div>
      </FrameComponent>
    </div>
  </div>
);
export default connectToRedux(TransferComponent);
