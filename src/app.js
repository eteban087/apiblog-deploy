const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const cors = require('cors');
const sanatizater = require('perfect-express-sanitizer');
const routerUsers = require('./routes/user.routes');
const routerAuth = require('./routes/auth.routes');
const routerPosts = require('./routes/posts.routes');
const routerComments = require('./routes/comments.routes');
const globalErrohandler = require('./controller/error.controller');
const AppError = require('./helpers/appErros');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(hpp());

app.use(
  sanatizater.clean({
    xss: true,
    noSql: true,
    sql: false, // obligatoriamente debe ir en false
  })
);

let limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'too many request from this IP, please try again in an hour!',
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1', limiter);
app.use('/api/v1/users/', routerUsers);
app.use('/api/v1/auth/', routerAuth);
app.use('/api/v1/posts/', routerPosts);
app.use('/api/v1/comments/', routerComments);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`can´t  find ${req.originalUrl} on this server`, 404)
  );
});

app.use(globalErrohandler);

module.exports = app;
