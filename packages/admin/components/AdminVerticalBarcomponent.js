import React from 'react';

import { doLogout } from '../stores/UserState';
import VerticalBarComponent from './VerticalBarComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';

import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums/';
import {
  DesktopMac,
  AccountBox,
  AccountCircle,
  SupervisorAccount,
  Receipt,
  SettingsInputSvideo,
  Settings,
  ExitToApp
} from '@material-ui/icons';
const { ROLE_ADMIN } = ACCOUNT_ROLES;

const AdminVerticalBarComponent = ({ t, currentUser = {} }) => {
  const sysNavbarStructures = [
    {
      name: '',
      label: t('menu.dashboard.label'),
      icon: <DesktopMac fontSize="small" />
    },
    {
      name: 'partner',
      label: t('menu.partner.label'),
      icon: <SupervisorAccount fontSize="small" />,
      subPaths: [
        {
          label: t('menu.partner.sub_menu.manage_partner'),
          name: 'manage'
        },
        {
          label: t('menu.partner.sub_menu.users'),
          name: 'users'
        }
      ]
    },
    {
      name: 'moderators',
      label: t('menu.moderator.label'),
      icon: <AccountBox fontSize="small" />
    },
    {
      name: 'users',
      label: t('menu.user.label'),
      icon: <AccountCircle fontSize="small" />
    },
    {
      name: 'transaction',
      label: t('menu.transaction.label'),
      icon: <Receipt fontSize="small" />,
      subPaths: [
        {
          label: t('menu.transaction.sub_menu.transactions'),
          name: 'transactions'
        },
        {
          label: t('menu.transaction.sub_menu.pending_transactions'),
          name: 'pending-transactions'
        },
        {
          label: t('menu.transaction.sub_menu.virtual_wallets'),
          name: 'ewallets'
        }
      ]
    },
    {
      name: 'coins',
      label: t('menu.coin.label'),
      icon: <SettingsInputSvideo fontSize="small" />
    },
    {
      name: 'settings',
      label: t('menu.setting.label'),
      icon: <Settings fontSize="small" />
    },
    {
      label: t('menu.logout.label'),
      icon: <ExitToApp fontSize="small" />,
      onClick: doLogout
    }
  ];

  const modNavbarStructures = [
    {
      name: '',
      label: t('menu.dashboard.label'),
      icon: <DesktopMac fontSize="small" />
    },
    {
      name: 'partner',
      label: t('menu.partner.label'),
      icon: <SupervisorAccount fontSize="small" />,
      subPaths: [
        {
          label: t('menu.partner.sub_menu.manage_partner'),
          name: 'manage'
        },
        {
          label: t('menu.partner.sub_menu.users'),
          name: 'users'
        },
        {
          label: t('menu.partner.sub_menu.activity'),
          name: 'activities'
        }
      ]
    },
    {
      name: 'users',
      label: t('menu.user.label'),
      icon: <AccountCircle fontSize="small" />
    },
    {
      name: 'transaction',
      label: t('menu.transaction.label'),
      icon: <Receipt fontSize="small" />,
      subPaths: [
        {
          label: t('menu.transaction.sub_menu.transactions'),
          name: 'transactions'
        },
        {
          label: t('menu.transaction.sub_menu.virtual_wallets'),
          name: 'ewallets'
        }
      ]
    },
    {
      name: 'coins',
      label: t('menu.coin.label'),
      icon: <SettingsInputSvideo fontSize="small" />
    },
    {
      name: 'settings',
      label: t('menu.setting.label'),
      icon: <Settings fontSize="small" />
    },
    {
      label: t('menu.logout.label'),
      icon: <ExitToApp fontSize="small" />,
      onClick: doLogout
    }
  ];

  const getNavbarStructures = role =>
    role === ROLE_ADMIN ? sysNavbarStructures : modNavbarStructures;

  return (
    <VerticalBarComponent
      navbarStructures={getNavbarStructures(currentUser.systemUserRole)}
    />
  );
};

export default withTranslation('admin-page-layout')(AdminVerticalBarComponent);
