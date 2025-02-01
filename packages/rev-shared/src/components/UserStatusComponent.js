import React from 'react';
import {
  U_ACTIVE,
  U_BANNED,
  U_CANCELLED,
  U_PENDING,
  U_REJECTED,
  U_SUSPENDED
} from '../enums/status';

import { Done, CancelPresentation, AvTimer, Block } from '@material-ui/icons';
import { ThemeConsumer } from '../layouts/Theme';
import { Grid } from '@material-ui/core';

const getUserStatusLabel = ({ status, t }) => {
  switch (status) {
    case U_ACTIVE:
      return t('common:rev_shared.enums.status.user.u_active');
    case U_BANNED:
      return t('common:rev_shared.enums.status.user.u_banned');
    case U_CANCELLED:
      return t('common:rev_shared.enums.status.user.u_cancelled');
    case U_PENDING:
      return t('common:rev_shared.enums.status.user.u_pending');
    case U_REJECTED:
      return t('common:rev_shared.enums.status.user.u_rejected');
    case U_SUSPENDED:
      return t('common:rev_shared.enums.status.user.u_suspended');
    default:
      return '';
  }
};
const getUserStatusIcon = ({ theme = {}, status }) => {
  switch (status) {
    case U_REJECTED:
    case U_CANCELLED:
      return (
        <CancelPresentation
          fontSize="small"
          style={{ color: theme.dangerColor }}
        />
      );
    case U_PENDING:
      return <AvTimer fontSize="small" style={{ color: theme.primaryColor }} />;
    case U_ACTIVE:
      return <Done fontSize="small" style={{ color: theme.successColor }} />;
    case U_BANNED:
    case U_SUSPENDED:
      return <Block fontSize="small" style={{ color: theme.warningColor }} />;
    default:
      break;
  }
};

const UserStatusComponent = ({ status, t }) => (
  <ThemeConsumer>
    {theme => (
      <Grid container alignItems="center">
        {getUserStatusIcon({ theme, status })}
        <span>&nbsp;</span>
        {getUserStatusLabel({ status, t })}
      </Grid>
    )}
  </ThemeConsumer>
);

export default UserStatusComponent;
