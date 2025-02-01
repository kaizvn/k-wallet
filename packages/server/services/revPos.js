const REV_POS_URL = 'http://209.246.143.138';
const REV_POS_KEY = 'ck_944bb6057c23c204d37c3b7e7a3a0f92db2c673c';
const REV_POS_SECRET_KEY = 'cs_4528ae38fe22c7d4f8029923320b886598fc5b1f';

const WooCommerceAPI = require('woocommerce-api');

const WooCommerce = new WooCommerceAPI({
  url: REV_POS_URL,
  consumerKey: REV_POS_KEY,
  consumerSecret: REV_POS_SECRET_KEY,
  wpAPI: true,
  version: 'wc/v3'
});

export const getOrderList = () => {
  return new Promise((resolve, reject) => {
    WooCommerce.get('orders', (err, data, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

export const getProductsList = () => {
  return new Promise((resolve, reject) => {
    WooCommerce.get('products', (err, data, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
