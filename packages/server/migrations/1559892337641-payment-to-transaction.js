import '../_env';

import mongoose from 'mongoose';

import { ETH_COIN_ID, BTC_COIN_ID } from '../graphql/enums/coinId';
import {
  TYPE_TX_DEPOSIT,
  TYPE_TX_WITHDRAW
} from '../graphql/enums/transactionType';
import { getCoinById } from '../services/base';

const orderTypes = { ORDER_DEPOSIT: 0, ORDER_WITHDRAW: 1 };
const billTypes = { BILL_DEPOSIT: 0, BILL_WITHDRAW: 1 };

const { MONGO_REPLICA_URL, MONGO_URL, MONGO_DB, MONGO_OPTIONS } = process.env;

const mongoUrl = MONGO_REPLICA_URL || MONGO_URL || 'mongodb://localhost:27017';
const dbName = MONGO_DB || 'RevPayment';

const options = MONGO_OPTIONS
  ? JSON.parse(MONGO_OPTIONS)
  : {
      useNewUrlParser: true
    };

const connectDb = () => {
  return new Promise((resolve, reject) =>
    mongoose.connect(mongoUrl + '/' + dbName, options, err => {
      if (err) {
        reject(err);
      }
      resolve(mongoose);
    })
  );
};

const insertTxToDb = tx =>
  mongoose.connection.db.collection('transactions').insertOne(tx);

const insertBillToDb = bill =>
  mongoose.connection.db.collection('bills').insertOne(bill);

const convertPaymentToTx = async (payment, order) => {
  const {
    pow,
    transaction_hash,
    from_wallet_address,
    to_wallet_address,
    coin_id,
    order_id,
    ...tx
  } = payment;

  tx.hash = transaction_hash;
  tx.bill_id = order_id;

  if (order.type === orderTypes.ORDER_DEPOSIT) {
    tx.type = TYPE_TX_DEPOSIT;
    tx.to_wallet_owner_id = order.owner_id;
  } else {
    tx.type = TYPE_TX_WITHDRAW;
    tx.from_wallet_owner_id = order.owner_id;
  }

  const coinSymbol = await getCoinById(coin_id);
  if (coinSymbol === 'eth') {
    tx.coin_id = ETH_COIN_ID;
  } else if (coinSymbol === 'btc') {
    tx.coin_id = BTC_COIN_ID;
  }

  await insertTxToDb(tx);
};

const convertOrderToBill = async order => {
  const { coin_id, payment_ids, ...bill } = order;

  bill.transaction_ids = payment_ids;

  const coinSymbol = await getCoinById(coin_id);
  if (coinSymbol === 'eth') {
    bill.coin_id = ETH_COIN_ID;
  } else if (coinSymbol === 'btc') {
    bill.coin_id = BTC_COIN_ID;
  }

  await insertBillToDb(bill);
};

const getOrders = () =>
  mongoose.connection.db
    .collection('orders')
    .find({
      $or: [
        { type: orderTypes.ORDER_DEPOSIT },
        { type: orderTypes.ORDER_WITHDRAW }
      ]
    })
    .toArray();

const getPaymentFromOrder = order => {
  const paymentId = order.payment_ids[0];

  return mongoose.connection.db
    .collection('payments')
    .findOne({ id: paymentId });
};

const dropPayment = payment =>
  mongoose.connection.db.collection('payments').deleteOne({ id: payment.id });

const dropOrder = order =>
  mongoose.connection.db.collection('orders').deleteOne({ id: order.id });

const dropTx = tx =>
  mongoose.connection.db.collection('transactions').deleteOne({ id: tx.id });

const dropBill = bill =>
  mongoose.connection.db.collection('bills').deleteOne({ id: bill.id });

const getBills = () =>
  mongoose.connection.db
    .collection('bills')
    .find({
      $or: [{ type: billTypes.BILL_DEPOSIT }, { type: billTypes.BILL_WITHDRAW }]
    })
    .toArray();

const getTxFromBill = bill => {
  const txId = bill.transaction_ids[0];

  return mongoose.connection.db
    .collection('transactions')
    .findOne({ id: txId });
};

const insertPaymentToDb = payment =>
  mongoose.connection.db.collection('payments').insertOne(payment);

const insertOrderToDb = order =>
  mongoose.connection.db.collection('orders').insertOne(order);

const convertTxToPayment = async tx => {
  const {
    hash,
    from_wallet_owner_id,
    to_wallet_owner_id,
    bill_id,
    type,
    ...payment
  } = tx;

  payment.transaction_hash = hash;
  tx.order_id = bill_id;

  await insertPaymentToDb(payment);
};

const convertBillToOrder = async bill => {
  const { transaction_ids, ...order } = bill;
  order.payment_ids = transaction_ids;

  await insertOrderToDb(order);
};

module.exports.up = async function() {
  const db = await connectDb();
  const orders = await getOrders();
  for (let order of orders) {
    const payment = await getPaymentFromOrder(order);
    if (payment) {
      await convertPaymentToTx(payment, order);
      await dropPayment(payment);
    }
    await convertOrderToBill(order);
    await dropOrder(order);
  }

  await db.disconnect();
};

module.exports.down = async function() {
  const db = await connectDb();

  const bills = await getBills();

  for (let bill of bills) {
    const tx = await getTxFromBill(bill);
    if (tx) {
      await convertTxToPayment(tx);
      await dropTx(tx);
    }
    await convertBillToOrder(bill);
    await dropBill(bill);
  }

  await db.disconnect();
};
