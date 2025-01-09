const Redis = require('ioredis');

const redis = new Redis({
  host:process.env.REDIS_HOST, // Replace with your Redis host
  port: process.env.REDIS_PORT,                                                  // Replace with your Redis port
  username: process.env.REDIS_USERNAME,                                          // Username (if required by your Redis service)
  password: process.env.REDIS_PASSWORD,                            // Replace with your actual password
});

redis.on('error', (err) => console.log('Redis Client Error', err)); // Logs errors
redis.on('connect', () => console.log('Connected to Redis'));       // Confirms connection

module.exports = redis;
