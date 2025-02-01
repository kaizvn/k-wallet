import React from 'react';
import Router from 'next/router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { createLink } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { Button, RLink } from '@revtech/rev-shared/layouts';
import {
  FrameComponent,
  FrameHeaderComponent,
  BillDetailsCardComponent,
  EmptyDataComponent
} from '@revtech/rev-shared/components';
import { getBillDetailsSelector, getBillDetails } from '../stores/BillingState';

const connectToRedux = connect(
  createStructuredSelector({
    bill: getBillDetailsSelector
  }),
  dispatch => ({
    getBillDetails: id => dispatch(getBillDetails(id))
  })
);

const enhance = compose(
  connectToRedux,
  withTranslation('transaction')
);

class BillingDetailsComponent extends React.Component {
  componentWillMount() {
    this.props.getBillDetails(Router.query.id);
  }

  render() {
    const { bill, t } = this.props;
    return !bill ? (
      <EmptyDataComponent message="not found any bill." />
    ) : (
      <FrameComponent>
        <FrameHeaderComponent title={t('detail.billing.title')}>
          <RLink href={createLink(['transaction', `details?id=${bill.id}`])}>
            <Button>{t('detail.billing.button.transaction_detail')}</Button>
          </RLink>
        </FrameHeaderComponent>
        <div className="container card-block">
          <BillDetailsCardComponent bill={bill} />
        </div>
      </FrameComponent>
    );
  }
}

export default enhance(BillingDetailsComponent);
