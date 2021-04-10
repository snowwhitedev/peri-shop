const express = require('express');
const router = express.Router();

router.use('/', require('./stores.routes'));
router.use('/subscriptions', require('./subscriptions.routes'));
router.use('/coupons', require('./coupons.routes'));

module.exports = router;
