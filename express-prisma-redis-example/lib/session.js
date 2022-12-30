const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const redis = require('@/lib/redis');

const log4js = require('log4js');
const logger = log4js.getLogger('config');
logger.level = 'debug';

const secret = process.env.TOKEN_SECRET;

const testing = process.env.NODE_ENV == 'test';
if (typeof secret != 'string' || secret.length == 0) {
  if (!testing) {
    throw Error('no-valid-secret');
  }
}

const tokenTtl = 10 * 60; //10min
const refreshTokenTtl = 1 * 60 * 60; //1h

async function generateAccessToken(id, publicId) {
  const data = { id, publicId };
  const refreshToken = uuidv4();
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + tokenTtl,
    data: { 
      ...data,
      refreshToken,
    },
  }, secret);
  const client = await redis();
  await client.set(`refreshToken:${refreshToken}`, JSON.stringify({ ...data, token }), { //here we add the refresh token to the whitelist
    EX: refreshTokenTtl,
    NX: true,
  });
  return { token, refreshToken };
}

const verifyToken = token => new Promise((resolve, reject) => {
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      reject(err);
    }
    else {
      resolve(user);
    }
  });
});

//decode token, then check the datatabese
async function authenticateToken(token) {
  if (!token) return null;

  const tokenData = await verifyToken(token);
  if (!tokenData) return null;
  const client = await redis();
  if (await client.exists(`token:${token}`)) { //token is blacklisted
    logger.debug('got blacklisted token', token, tokenData);
    return null;
  }
  return tokenData;
}

async function regenerateAccessToken(refreshToken) {
  const client = await redis();
  const userData = await client.get(`refreshToken:${refreshToken}`);
  const delCount = await client.del(`refreshToken:${refreshToken}`);
  if (!userData || !(delCount > 0)) {
    throw Error('invalid-refresh-token');
  }
  else {
    const userObj = JSON.parse(userData);
    await invalidateToken(userObj.token);
    return generateAccessToken(userObj.id, userObj.publicId);
  }
}

async function invalidateToken(token) {
  logger.debug('invalidate token', token);
  const client = await redis();
  await client.set(`token:${token}`, '1', {
    EX: tokenTtl,
    NX: true,
  });
}

async function invalidateRefreshToken(refreshToken) {
  const client = await redis();
  return await client.del(`refreshToken:${refreshToken}`);
}

function getToken(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token;
}

const sessionMiddleware = () => (async (req, res, next) => {
  try {
    const token = getToken(req);
    const userData = await authenticateToken(token);
    if (userData) {
      req.session = userData.data;
    }
    else {
      req.session = { id: null };
    }
  } catch(e) {
    req.session = { id: null };
  }
  next();
});

const filterAuth = () => ((req, res, next) => {
  if (typeof req.session == 'object' && req.session.hasOwnProperty('id') && req.session.id !== null) {
    next();
  }
  else {
    next({ message: 'no-access' });
  }
});

module.exports = { getToken, sessionMiddleware, filterAuth, generateAccessToken, regenerateAccessToken, invalidateToken, invalidateRefreshToken, verifyToken };
