// src/config/redis.js
// Redis — caching ke liye
// Agar Redis nahi mila toh app chal sakta hai — warning aayegi

'use strict';

const { createClient } = require('redis');
const env = require('./env');

const client = createClient({
  socket: {
    host: env.redis.host,
    port: env.redis.port,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('❌ Redis max retries reached');
        return new Error('Redis max retries');
      }
      return Math.min(retries * 100, 3000); // retry delay
    },
  },
  ...(env.redis.password && { password: env.redis.password }),
});

client.on('connect', () => console.log('✅ Redis connected successfully'));
client.on('error',   (err) => console.error('⚠️  Redis error:', err.message));

// Connect karo
(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('⚠️  Redis connection failed — caching disabled:', err.message);
  }
})();

module.exports = client;
