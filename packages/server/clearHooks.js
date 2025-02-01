import './_env';
import mongoose from 'mongoose';
import { TRANSACTION_PENDING } from './graphql/enums/transactionStatus';
import { getCryptoLibByCoinId } from './services/cryptoLibs';
import { Transactions, Coins } from './services';
import { parseBoolean, sleep } from './utils';

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;
const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : {
      useNewUrlParser: true
    };

options.useUnifiedTopology = true;

const connectDb = () => {
  return new Promise((resolve, reject) =>
    mongoose.connect(mongoUrl + '/' + dbName, options, (err) => {
      if (err) {
        reject(err);
      }
      resolve(mongoose);
    })
  );
};

async function getCoinEnabled() {
  const coins = await Coins.find();
  let coinsEnabled = [];

  for (const coin of coins) {
    const isEnable = process.env[`ENABLE_${coin.symbol}`];
    if (parseBoolean(isEnable)) coinsEnabled.push(coin.id);
  }
  return coinsEnabled;
}

async function checkAllowDeleteHook(hook) {
  let allowCondition = {
    status: TRANSACTION_PENDING
  };

  //For address hook
  if (hook.address) {
    allowCondition.received_address = hook.address;
  } else if (hook.hash) {
    //For hash hook
    allowCondition.hash = hook.hash;
  } else if (hook.input_address) {
    //For forward hook
    allowCondition.received_address = hook.input_address;
  }

  const transactionPending = await Transactions.findOne(allowCondition);

  if (transactionPending) return false;

  return true;
}

async function cleanHooks(coinId) {
  const cryptoLib = getCryptoLibByCoinId(coinId);
  const hooks = await cryptoLib.getHookList();

  console.log('Clear hooks of Coin: ', coinId);

  for (const hook of hooks) {
    const isAllowDelete = await checkAllowDeleteHook(hook);
    if (isAllowDelete) {
      await cryptoLib.deleteHook(hook.id);
      await sleep(1000);
      console.log(`Hook id: ${hook.id} deleted`);
    }
  }
}

async function cleanForwards(coinId) {
  const cryptoLib = getCryptoLibByCoinId(coinId);
  const isPFSupport = cryptoLib.isPFSupport();

  if (!isPFSupport) return;

  const forwards = await cryptoLib.getForwards();

  console.log('Clear forwards of Coin: ', coinId);

  for (const forward of forwards) {
    const isAllowDelete = await checkAllowDeleteHook(forward);

    if (isAllowDelete) {
      await cryptoLib.deleteForward(forward.id);
      await sleep(1000);
      console.log(`Forward id: ${forward.id} deleted`);
    }
  }
}

async function main() {
  const db = await connectDb();
  const coinsEnabled = await getCoinEnabled();

  for (const coinId of coinsEnabled) {
    await cleanHooks(coinId);
    await cleanForwards(coinId);
  }

  await db.disconnect();

  process.exit();
}

main();
