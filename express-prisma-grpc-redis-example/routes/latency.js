const express = require('express');
const log4js = require('log4js');
const { filterAuth } = require('@/lib/session');

const logger = log4js.getLogger('config');
logger.level = 'debug';
const router = express.Router();

const dev = process.env.NODE_ENV != 'production';

router.get('/', filterAuth(), async function (req, res, next) {
  try {
    if (!req._startAt) { //provided by morgan
      return res.json({
        latency: null,
      });
    }
    const elapsed = process.hrtime(req._startAt);
    const ms = (elapsed[0] * 1e3) + (elapsed[1] * 1e-6)
    const latency = `${ms.toFixed(3)}ms`;
    return res.json({
      latency,
    });
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

module.exports = router;
