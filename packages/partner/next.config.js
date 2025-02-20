const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  webpack: config => {
    config.node = {
      fs: 'empty'
    };

    config.plugins = config.plugins || [];

    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new Dotenv({
        path: path.join(__dirname, 'env/.env'),
        systemvars: true
      })
    ];

    return config;
  }
};
