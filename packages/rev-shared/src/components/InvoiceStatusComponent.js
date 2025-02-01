import React from 'react';
import {
  INVOICE_OVERDUE,
  INVOICE_CANCELLED,
  INVOICE_OPEN,
  INVOICE_CONFIRMED
} from '../enums/status';

import { Done, CancelPresentation, Block, LockOpen } from '@material-ui/icons';
import { ThemeConsumer } from '../layouts/Theme';
import { Grid } from '@material-ui/core';

const getInvoiceStatusLabel = ({ status, t }) => {
  switch (status) {
    case INVOICE_OPEN:
      return t('common:rev_shared.enums.status.invoice.open');
    case INVOICE_CONFIRMED:
      return t('common:rev_shared.enums.status.invoice.confirmed');
    case INVOICE_CANCELLED:
      return t('common:rev_shared.enums.status.invoice.cancelled');
    case INVOICE_OVERDUE:
      return t('common:rev_shared.enums.status.invoice.overdue');
    default:
      return '';
  }
};
const getInvoiceStatusIcon = ({ theme = {}, status }) => {
  switch (status) {
    case INVOICE_CANCELLED:
      return (
        <CancelPresentation
          fontSize="small"
          style={{ color: theme.dangerColor }}
        />
      );
    case INVOICE_OPEN:
      return (
        <LockOpen fontSize="small" style={{ color: theme.successColor }} />
      );
    case INVOICE_CONFIRMED:
      return <Done fontSize="small" style={{ color: theme.successColor }} />;
    case INVOICE_OVERDUE:
      return <Block fontSize="small" style={{ color: theme.warningColor }} />;
    default:
      break;
  }
};

const InvoiceStatusComponent = ({ status, t }) => (
  <ThemeConsumer>
    {theme => (
      <Grid container alignItems="center">
        {getInvoiceStatusIcon({ theme, status })}
        <span>&nbsp;</span>
        {getInvoiceStatusLabel({ status, t })}
      </Grid>
    )}
  </ThemeConsumer>
);

export default InvoiceStatusComponent;
