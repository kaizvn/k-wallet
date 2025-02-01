import React from 'react';
import {
  P_ACTIVE,
  P_BANNED,
  P_PENDING,
  P_REJECTED,
  P_SUSPENDED,
  P_CANCELLED
} from '../enums/status';
import { CancelPresentation, AvTimer, Done, Block } from '@material-ui/icons';
import { ThemeConsumer } from '../layouts/Theme';
import { Grid } from '@material-ui/core';

const getPartnerStatusLabel = ({ status, t }) => {
  switch (status) {
    case P_ACTIVE:
      return t('common:rev_shared.enums.status.partner.p_active');
    case P_BANNED:
      return t('common:rev_shared.enums.status.partner.p_banned');
    case P_CANCELLED:
      return t('common:rev_shared.enums.status.partner.p_cancelled');
    case P_PENDING:
      return t('common:rev_shared.enums.status.partner.p_pending');
    case P_REJECTED:
      return t('common:rev_shared.enums.status.partner.p_rejected');
    case P_SUSPENDED:
      return t('common:rev_shared.enums.status.partner.p_suspended');
    default:
      return '';
  }
};

const getPartnerStatusIcon = ({ theme = {}, status }) => {
  switch (status) {
    case P_REJECTED:
    case P_CANCELLED:
      return (
        <CancelPresentation
          fontSize="small"
          style={{ color: theme.dangerColor }}
        />
      );
    case P_PENDING:
      return <AvTimer fontSize="small" style={{ color: theme.primaryColor }} />;
    case P_ACTIVE:
      return <Done fontSize="small" style={{ color: theme.successColor }} />;
    case P_BANNED:
    case P_SUSPENDED:
      return <Block fontSize="small" style={{ color: theme.warningColor }} />;
    default:
      break;
  }
};

const PartnerStatusComponent = ({ status, t }) => (
  <ThemeConsumer>
    {theme => (
      <Grid>
        <Grid container alignItems="center">
          {getPartnerStatusIcon({ theme, status })}
          <span>&nbsp;</span>
          {getPartnerStatusLabel({ status, t })}
        </Grid>
      </Grid>
    )}
  </ThemeConsumer>
);

export default PartnerStatusComponent;
