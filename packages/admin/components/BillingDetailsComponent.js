import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import React from 'react';
import Router from 'next/router';
import { compose } from 'recompose';

import { getBillDetailsSelector, getBillDetails } from '../stores/BillingState';
import { createLink } from '@revtech/rev-shared/libs';
import { withTranslation } from '@revtech/rev-shared/i18n';
import {
  FrameComponent,
  FrameHeaderComponent,
  BillDetailsCardComponent,
  EmptyDataComponent
} from '@revtech/rev-shared/components';
import { Button, RLink } from '@revtech/rev-shared/layouts';

const connectToRedux = connect(
  createStructuredSelector({
    bill: getBillDetailsSelector
  }),
  dispatch => ({
    getBillDetails: id => dispatch(getBillDetails(id))
  })
);
const enhance = compose(
  withTranslation('transaction'),
  connectToRedux
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
        <FrameHeaderComponent title={t('billing.details.title')}>
          <RLink href={createLink(['transaction', `details?id=${bill.id}`])}>
            <Button>
              {t('billing.details.button.view_transaction_details')}
            </Button>
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
