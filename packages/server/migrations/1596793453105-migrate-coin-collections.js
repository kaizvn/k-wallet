import mongoose from 'mongoose';
import Coins from '../models/coin';

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : { useNewUrlParser: true };

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

const COIN_DATA = {
  btc: {
    network: 'main',
    decimals: 8
  },
  doge: {
    network: 'main',
    decimals: 8
  },
  dash: {
    network: 'main',
    decimals: 8
  },
  ltc: {
    network: 'main',
    decimals: 8
  },
  eth: {
    network: 'main',
    decimals: 18
  },
  beth: {
    network: 'test',
    decimals: 18
  },
  bcy: {
    network: 'test',
    decimals: 8
  },
  usdt: {
    contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    network: 'homestead',
    decimals: 6
  },
  fau: {
    status: 1,
    minimum_withdrawal: 0.1,
    fee_percentage: 0,
    is_compound_support: false,
    id: 'fau',
    network: 'rinkeby',
    contract_address: '0xFab46E002BbF0b4509813474841E0716E6730136',
    name: 'FaucetToken',
    decimals: 18,
    symbol: 'FAU',
    master_address: '0x465C963696359251FA60CD0a1f0616222bB6A403',
    master_key:
      'a682a25e11f78ebcaf78dee253eaa4c9b6e107909990a1d8f80d8f5693187209',
    logo: 'https://etherscan.io/images/gen/aax.jpg'
  }
};

module.exports.up = async function () {
  const db = await connectDb();
  const coins = await Coins.find();

  const result = await Promise.all(
    coins.map(async (coin) => {
      const newData = COIN_DATA[coin.id] || {};
      console.log('coin', coin, newData);
      return Coins.updateOne({ id: coin.id }, { $set: newData });
    })
  );

  console.log({ result });
  let fauCoin = coins.filter((coin) => coin.id === 'fau');
  if (!fauCoin) {
    fauCoin = new Coins(COIN_DATA['fau']);
    await fauCoin.save();
  }

  await db.disconnect();
};

module.exports.down = async function () {
  const db = await connectDb();

  await db.disconnect();
};
