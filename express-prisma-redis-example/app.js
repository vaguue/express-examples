require('module-alias/register');
require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');

const { sessionMiddleware } = require('@/lib/session');

const authRouter = require('./routes/auth');
const fileRouter = require('./routes/file');
const latencyRouter = require('./routes/latency');

const app = express();

app.use(cors({
  credentials: true,
  origin: (origin, callback) => {
    callback(null, true);
  },
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(sessionMiddleware());

app.use('/', authRouter);
app.use('/file', fileRouter);
app.use('/latency', latencyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.message == 'no-access') {
    res.status(err.status || 250);
    res.json({ message: 'no-access' });
  }
  else {
    res.status(err.status || 500);
    res.json({ message: 'error' });
  }
});

module.exports = app;
