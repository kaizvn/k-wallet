import WalletAddresses from '../models/walletAddress';
import WalletKeys from '../models/walletKey';

export const addNewWalletAddress = async ({
  coinId,
  address,
  privateKey,
  trackingId
}) => {
  const walletAddress = await new WalletAddresses({
    address,
    coin_id: coinId,
    tracking_id: trackingId
  }).save();

  await new WalletKeys({
    wallet_address_id: walletAddress.id,
    wallet_key: privateKey
  }).save();
};

export default WalletAddresses;
