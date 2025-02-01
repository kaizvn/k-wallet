import React from 'react';

import {
  TRANSACTION_CANCELLED,
  TRANSACTION_FINISHED,
  TRANSACTION_PENDING,
  TRANSACTION_REJECTED,
  TRANSACTION_REVERTED,
  TRANSACTION_PENDING_ADMIN_APPROVAL,
  TRANSACTION_PENDING_PARTNER_APPROVAL,
  TRANSACTION_MANUAL_ADMIN
} from '../enums/status';
import { Chip } from '@material-ui/core';
import { Done } from '@material-ui/icons';
import { ThemeConsumer } from '../layouts/Theme';
const getTransactionStatusLabel = ({ status, t }) => {
  switch (status) {
    case TRANSACTION_CANCELLED:
      return t('common:rev_shared.enums.status.transaction.cancelled');
    case TRANSACTION_FINISHED:
      return t('common:rev_shared.enums.status.transaction.finished');
    case TRANSACTION_PENDING:
      return t('common:rev_shared.enums.status.transaction.pending');
    case TRANSACTION_REJECTED:
      return t('common:rev_shared.enums.status.transaction.rejected');
    case TRANSACTION_REVERTED:
      return t('common:rev_shared.enums.status.transaction.reverted');
    case TRANSACTION_PENDING_ADMIN_APPROVAL:
      return t(
        'common:rev_shared.enums.status.transaction.pending_admin_approval'
      );
    case TRANSACTION_PENDING_PARTNER_APPROVAL:
      return t(
        'common:rev_shared.enums.status.transaction.pending_partner_approval'
      );
    case TRANSACTION_MANUAL_ADMIN:
      return t(
        'common:rev_shared.enums.status.transaction.pending_admin_manual'
      );
    default:
      return '';
  }
};

const getColorByTransactionStatus = ({ theme = {}, status }) => {
  switch (status) {
    case TRANSACTION_PENDING:
    case TRANSACTION_PENDING_ADMIN_APPROVAL:
    case TRANSACTION_PENDING_PARTNER_APPROVAL:
    case TRANSACTION_MANUAL_ADMIN:
      return theme.primaryColor;
    case TRANSACTION_REJECTED:
      return theme.dangerColor;
    case TRANSACTION_FINISHED:
      return theme.successColor;
    case TRANSACTION_CANCELLED:
      return theme.lightBlueColor;
    case TRANSACTION_REVERTED:
      return theme.warningColor;
    default:
      break;
  }
};

const TransactionStatusComponent = ({ status, t }) => (
  <ThemeConsumer>
    {theme => {
      const txColor = getColorByTransactionStatus({ theme, status });
      return (
        <Chip
          variant="outlined"
          size="small"
          label={getTransactionStatusLabel({ status, t })}
          style={{ color: txColor, border: `1px solid ${txColor}` }}
          deleteIcon={<Done />}
        />
      );
    }}
  </ThemeConsumer>
);
export default TransactionStatusComponent;
