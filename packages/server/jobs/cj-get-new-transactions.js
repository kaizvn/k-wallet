import { EWallets, WalletAddresses } from '../services';
import { getCryptoLibByCoinId } from '../services/cryptoLibs';
import { getFromDateScan } from '../utils/currencies';

const getAllAddresses = async () =>
  EWallets.aggregate([
    {
      $match: { updated_at: { $gt: getFromDateScan() } }
    },
    { $unwind: '$deposit_addresses' },
    {
      $project: {
        id: 1,
        deposit_addresses: 1,
        type: 1,
        owner_id: 1,
        coin_id: 1
      }
    }
  ]);

const getNewTransactionCJ = async () => {
  console.log('Get new deposit transactions');
  try {
    const ewallets = await getAllAddresses();
    let unprocessedTxs;

    await Promise.all(
      ewallets.map(async ewallet => {
        const cryptoLib = getCryptoLibByCoinId(ewallet.coin_id);
        const transactions = await cryptoLib.getTransactionsOfAddress(
          ewallet.deposit_addresses
        );

        if (!transactions || transactions.length === 0) {
          return;
        }

        const walletAddressDetails = await WalletAddresses.findOne({
          address: ewallet.deposit_addresses
        });

        unprocessedTxs = cryptoLib.getUnprocessedTxsFromWalletData(
          walletAddressDetails
        )(transactions);

        if (unprocessedTxs && unprocessedTxs.length) {
          walletAddressDetails.last_transaction_hash = unprocessedTxs[0].hash;
          walletAddressDetails.deposit_transactions.push(...unprocessedTxs);

          return walletAddressDetails.save();
        }
      })
    );

    console.log('End get new transactions');
  } catch (e) {
    console.log('getNewTransactions error: ', e);
  }
};

export default {
  name: 'Get New Transactions',
  interval: '0 */5 * * * *',
  handler: getNewTransactionCJ
};
