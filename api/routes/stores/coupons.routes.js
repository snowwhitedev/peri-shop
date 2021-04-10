const express = require('express');
const router = express.Router();

const { handleFetchCouponById } = require('../../handlers/coupons');
const { isAuthValidAll } = require('../../middlewares/index').auth;

router.get('/:coupon_id', isAuthValidAll, handleFetchCouponById);

module.exports = router;
