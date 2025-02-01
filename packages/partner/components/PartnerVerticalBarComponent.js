import React from 'react';
import { compose } from 'recompose';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { doLogout, currentUserSelector } from '../stores/UserState';
import VerticalBarComponent from './VerticalBarComponent';
import { withTranslation } from '@revtech/rev-shared/i18n';
import { ACCOUNT_ROLES } from '@revtech/rev-shared/enums/';
import {
  ExitToApp,
  Settings,
  Receipt,
  DesktopMac,
  SupervisorAccount
} from '@material-ui/icons';
const { ROLE_OWNER } = ACCOUNT_ROLES;

const connectToRedux = connect(
  createStructuredSelector({
    currentUser: currentUserSelector
  })
);

const enhance = compose(connectToRedux, withTranslation('partner-page-layout'));

const PartnerVerticalBarComponent = ({ t, currentUser }) => {
  const PartnerOwnerNavbarStructures = [
    {
      name: '',
      label: t('menu.partner_owner.dashboard.label'),
      icon: <DesktopMac fontSize="small" />
    },
    {
      name: 'member',
      label: t('menu.partner_owner.member.label'),
      icon: <SupervisorAccount fontSize="small" />,
      subPaths: [
        {
          label: t('menu.partner_owner.member.sub_menu.manage_member'),
          name: 'manage'
        }
      ]
    },
    {
      name: 'transaction',
      label: t('menu.partner_owner.transaction.label'),
      icon: <Receipt fontSize="small" />,
      subPaths: [
        {
          name: 'transactions',
          label: t('menu.partner_owner.transaction.sub_menu.transactions')
        },
        {
          label: t('menu.partner_owner.transaction.sub_menu.deposit'),
          name: 'deposit'
        },
        {
          label: t('menu.partner_owner.transaction.sub_menu.withdraw'),
          name: 'withdrawal'
        },
        {
          label: t(
            'menu.partner_owner.transaction.sub_menu.pending_transactions'
          ),
          name: 'pending-transactions'
        },
        {
          label: t('menu.partner_owner.transaction.sub_menu.virtual_wallets'),
          name: 'ewallets'
        }
      ]
    },
    {
      name: 'invoice',
      label: t('menu.partner_owner.invoice.label'),
      icon: <Receipt fontSize="small" />
    },
    {
      name: 'settings',
      label: t('menu.partner_owner.setting.label'),
      icon: <Settings fontSize="small" />
    },
    {
      label: t('menu.partner_owner.logout.label'),
      icon: <ExitToApp fontSize="small" />,
      onClick: doLogout
    }
  ];

  const PartnerMemberNavbarStructures = [
    {
      name: '',
      label: t('menu.partner_member.dashboard.label'),
      icon: <DesktopMac fontSize="small" />
    },
    {
      name: 'transaction',
      label: t('menu.partner_member.transaction.label'),
      icon: <Receipt fontSize="small" />,
      subPaths: [
        {
          name: 'transactions',
          label: t('menu.partner_member.transaction.sub_menu.transactions')
        },
        {
          label: t('menu.partner_member.transaction.sub_menu.deposit'),
          name: 'deposit'
        }
      ]
    },
    {
      name: 'settings',
      label: t('menu.partner_member.setting.label'),
      icon: <Settings fontSize="small" />
    },
    {
      label: t('menu.partner_member.logout.label'),
      icon: <ExitToApp fontSize="small" />,
      onClick: doLogout
    }
  ];
  const getNavbarStructures = role =>
    role === ROLE_OWNER
      ? PartnerOwnerNavbarStructures
      : PartnerMemberNavbarStructures;
  return (
    <VerticalBarComponent
      navbarStructures={getNavbarStructures(currentUser.partnerUserRole)}
    />
  );
};

export default enhance(PartnerVerticalBarComponent);
