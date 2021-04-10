const express = require('express');
const router = express.Router({ mergeParams: true });

// internal
const {
  isAuthValidAll,
  isUserMerchantOnStore
} = require('../../middlewares/auth');

const {
  validatePickupPayload
} = require('../../middlewares/index').validations;

const {
  handlerGetPickupsByStore
} = require('../../handlers/index');

const {
  handlerCreatePickupWithTimes,
  handlerGetPickupWithTimeById,
  handlerUpdatePickupById,
  handlerDisablePickup
} = require('../../handlers/pickups');

// Get all pickups by store id
// /stores/:store_id/pickups
router.get('/',
  isAuthValidAll,
  handlerGetPickupsByStore
);

// Get pickup detail by pickup id
// /stores/:store_id/pickups/:pickup_id
router.get('/:pickup_id',
  isAuthValidAll,
  handlerGetPickupWithTimeById
);

// Create pickup
router.post('/',
  isAuthValidAll,
  isUserMerchantOnStore,
  validatePickupPayload,
  handlerCreatePickupWithTimes
);

// Update a pickup
router.put('/:pickup_id',
  isAuthValidAll,
  isUserMerchantOnStore,
  validatePickupPayload,
  handlerUpdatePickupById
);

// delete pickup
router.delete('/:pickup_id',
  isAuthValidAll,
  isUserMerchantOnStore,
  handlerDisablePickup
);

module.exports = router;
