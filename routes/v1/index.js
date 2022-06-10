const express = require('express');
const accountRoute = require('./account.routes');
const authRoute = require('./auth.routes');
const articleRoute = require('./article.routes');
const lessorRoute = require('./lessor.routes');
const conversationRoute = require('./conversation.routes');
const messageRoute = require('./message.routes');
const locationRoute = require('./location.routes');
const imageRoute = require('./image.routes');
const adminRoute = require('./admin.routes');
const paymentRoute = require('./payment.routes');
const reviewRoute = require('./review.routes');
const reportReasonRoute = require('./reportReason.routes');

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
    },
    {
        path: '/conversation',
        route: conversationRoute,
    },
    {
        path: '/message',
        route: messageRoute,
    },
    {
        path: '/location',
        route: locationRoute,
    },
    {
        path: '/image',
        route: imageRoute,
    },
    {
        path: '/admin',
        route: adminRoute,
    },
    {
        path: '/payment',
        route: paymentRoute,
    },
    {
        path: '/review',
        route: reviewRoute,
    },
    {
        path: '/report-reason',
        route: reportReasonRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
