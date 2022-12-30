//since redis-om does not support TTL (except running the command manually) and we use Redis only to store tokens, 
//it seems suitable to use just a redis package
const { createClient } = require('redis');

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
    const client = createClient({ url });
    client.on('error', (err) => console.log('Redis Client Error', err));
    cached.promise = await client.connect().then(() => client);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = redis;
