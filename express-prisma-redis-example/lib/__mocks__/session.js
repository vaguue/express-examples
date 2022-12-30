const redis = require('./redis');
const session = jest.createMockFromModule('@/lib/session');

const mockUser = {
  publicId: 'id',
  id: 1,
  password: 'password',
};

session.getToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  return token;
};

session.authenticateToken = async (token) => {
  if (token == null) return null;

  const tokenData = await session.verifyToken(token);
  if (!tokenData) return null;
  const client = await redis();
  if (await client.exists(token)) { //token is blacklisted
    return null;
  }
  return tokenData;
};

session.sessionMiddleware = () => (async (req, res, next) => {
  try {
    const token = session.getToken(req);
    const userData = await session.authenticateToken(token);
    if (userData) {
      req.session = userData;
    }
    else {
      req.session = { id: null };
    }
  } catch(e) {
    req.session = { id: null };
  }
  next();
});

session.filterAuth = () => ((req, res, next) => {
  if (typeof req.session == 'object' && req.session.hasOwnProperty('id') && req.session.id !== null) {
    next();
  }
  else {
    next({ message: 'no-access' });
  }
});

session.generateAccessToken = (req, res, next) => {
  return {
    token: 'token',
    refreshTocken: 'refreshTocken',
  };
};

session.regenerateAccessToken = (refreshToken) => {
  if (refreshToken == 'refreshToken') {
    return {
      token: 'token',
      refreshTocken: 'refreshTocken',
    };
  }
  throw Error('invalid-refresh-token');
};

session.invalidateToken = async (token) => {
  const client = await redis();
  client.set(token, '1');
};

session.verifyToken = (token) => {
  if (token == 'token') {
    return mockUser;
  }
  else {
    return null;
  }
};

module.exports = session;
