import redis from 'redis';
import bluebird from 'bluebird';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
client.on('error', e => console.error('Redis Error:', e));

module.exports = client;
