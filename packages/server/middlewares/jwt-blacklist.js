import jwtBlacklist from 'express-jwt-blacklist';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

jwtBlacklist.configure({
  tokenId: 'id',
  //  strict: true, // wait for PR is approved.
  store: {
    type: 'redis',
    url: redisUrl,
    keyPrefix: 'jwtbl:',
    options: {
      secret: process.env.REDIS_SECRET,
      timeout: 10000,
      retry_strategy: options => {
        if (options.error && options.error.code === 'ECONNREFUSED') {
          // End reconnecting on a specific error and flush all commands with
          // a individual error
          return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
          // End reconnecting after a specific timeout and flush all commands
          // with a individual error
          return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
          // End reconnecting with built in error
          return undefined;
        }
        // reconnect after
        return Math.min(options.attempt * 100, 3000);
      }
    }
  }
});

module.exports = jwtBlacklist;
