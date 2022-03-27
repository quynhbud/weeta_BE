const express = require('express');
const accountRoute = require('./account.routes');
const authRoute = require('./auth.routes');
const articleRoute = require('./article.routes')
const lessorRoute = require('./lessor.route')

const router = express.Router();

const defaultRoutes = [
  {
    path: '/account',
    route: accountRoute,
  },
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/article',
    route: articleRoute,
  },
  {
    path: '/lessor',
    route: lessorRoute,
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;