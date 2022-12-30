const _ = require('lodash');
const express = require('express');
const log4js = require('log4js');

const { createUser, verifyUser } = require('@/lib/user');
const { terminateSession, getUserSessions, generateAccessToken, filterAuth } = require('@/lib/session');

const logger = log4js.getLogger('config');
logger.level = 'debug';
const router = express.Router();

const dev = process.env.NODE_ENV != 'production';

router.post('/signin', async function(req, res, next) {
  try {
    const user = await verifyUser(req.body || {});
    const token = await generateAccessToken(user);
    return res.json(token);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.post('/signup', async function(req, res, next) {
  try {
    const user = await createUser(req.body || {});
    const token = await generateAccessToken(user);
    return res.json(token);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/info', filterAuth(), async function(req, res, next) {
  try {
    return res.json(_.pick(req.session, 'id', 'idType'));
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

router.get('/logout', filterAuth(), async function(req, res, next) {
  try {
    const { all = false } = req.query;
    if (all) {
      const sessions = await getUserSessions(req.session);
      await Promise.all(sessions.map(terminateSession));
    }
    else {
      await terminateSession(req.session);
    }
    return res.json({
      message: 'ok', 
    });
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

module.exports = router;
