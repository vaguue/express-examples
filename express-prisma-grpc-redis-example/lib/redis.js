const { Client } = require('redis-om');

const url = process.env.REDIS_URL;

let cached = global.redis;

if (!cached) {
  cached = global.redis = { conn: null, promise: null };
}

async function redis() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const client = new Client().open(url);
    cached.promise = client;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = redis;
