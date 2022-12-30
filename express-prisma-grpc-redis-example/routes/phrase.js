const _ = require('lodash');
const express = require('express');
const log4js = require('log4js');

const { filterAuth } = require('@/lib/session');
const grpc = require('@/lib/grpc');

const logger = log4js.getLogger('config');
logger.level = 'debug';
const router = express.Router();

const dev = process.env.NODE_ENV != 'production';

const secret = process.env.API_SECRET;

router.get('/', filterAuth(), async function(req, res, next) {
  try {
    const client = grpc();
    const { content: phrase } = await new Promise((resolve, reject) => {
      client.getPhrase({ token: secret }, (err, res) => {
        if (err) {
          reject(err);
        }
        else {
          resolve(res);
        }
      });
    });
    return res.json(phrase);
  } catch(e) {
    logger.debug(e);
    return next(e);
  }
});

module.exports = router;
