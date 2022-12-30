const _ = require('lodash');
const express = require('express');
const log4js = require('log4js');

const { createUser, verifyUser } = require('@/lib/user');
const { invalidateToken, invalidateRefreshToken, getToken, generateAccessToken, regenerateAccessToken, filterAuth } = require('@/lib/session');

const logger = log4js.getLogger('config');
logger.level = 'debug';
const router = express.Router();

const dev = process.env.NODE_ENV != 'production';

router.post('/signin', async function(req, res, next) {
  try {
    const user = await verifyUser(req.body || {});
    const tokens = await generateAccessToken(user.innerId, user.id);
    return res.json(tokens);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.post('/signin/:new_token', async function(req, res, next) {
  try {
    const { refreshToken } = req.body || {};
    const newTokens = await regenerateAccessToken(refreshToken);
    return res.json(newTokens);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.post('/signup', async function(req, res, next) {
  try {
    const user = await createUser(req.body || {});
    const tokens = await generateAccessToken(user.innerId, user.id);
    return res.json(tokens);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/info', filterAuth(), async function(req, res, next) {
  try {
    return res.json(req.session.publicId);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/logout', filterAuth(), async function(req, res, next) {
  try {
    const token = getToken(req);
    await invalidateRefreshToken(req.session.refreshToken);
    await invalidateToken(token);
    return res.json({
      message: 'ok', 
    });
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

module.exports = router;
