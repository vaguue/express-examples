const { Entity, Schema } = require('redis-om');
const redis = require('@/lib/redis.js');

class Session extends Entity {
  bump(ttl) {
    this.exp = Math.max(Math.floor(Date.now() / 1000) + ttl, this.exp);
  }
  expired() {
    return Math.floor(Date.now() / 1000) >= this.exp;
  }
};

const sessionSchema = new Schema(Session, {
  exp: { type: 'number' },
  id: { type: 'string' },
  idType: { type: 'string' },
  innerId: { type: 'number' },
});


async function getSessionRepository() {
  const client = await redis();
  const sessionRepository = client.fetchRepository(sessionSchema);
  console.log('[*] creating index...');
  await sessionRepository.createIndex();
  console.log('[*] created index...');
  return sessionRepository;
}

module.exports = getSessionRepository;
