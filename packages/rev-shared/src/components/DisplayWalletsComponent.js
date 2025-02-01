import React from 'react';
import { withTranslation } from '../i18n';
import EmptyWalletMessageComponent from './EmptyWalletMessageComponent';

const DisplayWalletsComponent = ({ ewallets = [], WalletComponent, t }) =>
  !ewallets.length ? (
    <EmptyWalletMessageComponent t={t} />
  ) : (
    ewallets.map(wallet => <WalletComponent key={wallet.id} ewallet={wallet} />)
  );

export default withTranslation('common')(DisplayWalletsComponent);
