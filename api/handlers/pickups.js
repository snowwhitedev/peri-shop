const {
  createPickup,
  createBulkPickupTimeRecords,
  getListOfPickupsByStore,
  getPickupWithTimeById,
  upsertBulkPickupTimeRecords,
  softDeletePickupTimeRecord,
  updatePickupRecord,
  getPickupById,
  deletePickupRecord
} = require('../models/pickups');

exports.handlerGetPickupsByStore = async (req, res) => {
  const storeId = Number(req.params.store_id);
  try {
    const pickups = await getListOfPickupsByStore(storeId);
    return res.status(200).json({ pickups });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

// Create a record in the per_pickups table
// Create a record in the per_pickups_time table
exports.handlerCreatePickupWithTimes = async (req, res) => {
  const { pickUpTimes, pickup } = req.body;
  try {
    const pkTimeIdRows = await createBulkPickupTimeRecords(pickUpTimes);
    const pkTimeIds = pkTimeIdRows.map((item) => item.pickup_time_id);
    pickup.location = JSON.stringify(pickup.location);
    pickup.pickup_time_ids = pkTimeIds;
    const pickupRes = await createPickup(pickup);
    return res.status(200).json({ pickupRes });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handlerGetPickupWithTimeById = async (req, res) => {
  const { pickup_id } = req.params;
  try {
    const pickup = await getPickupWithTimeById(pickup_id);
    return res.status(200).json({ pickup });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handlerUpdatePickupById = async (req, res) => {
  const { pickup_id } = req.params;
  try {
    const { pickUpTimes, pickup } = req.body;
    const oldPickupTimeIds = pickup.pickup_time_ids;
    for (const pickupTime of pickUpTimes) {
      if (!pickupTime.pickup_time_id) {
        delete pickupTime.pickup_time_id;
      }
    }
    const newPickUpTimesRows = await upsertBulkPickupTimeRecords(pickUpTimes);
    const pickUpTimeIds = newPickUpTimesRows.map((item) => item.pickup_time_id);
    for (const idx of oldPickupTimeIds) {
      if (pickUpTimeIds.indexOf(Number(idx)) === -1) {
        await softDeletePickupTimeRecord(Number(idx));
      }
    }
    pickup.pickup_time_ids = pickUpTimeIds;
    pickup.location = JSON.stringify(pickup.location);
    const pickupRes = await updatePickupRecord(pickup_id, pickup);
    return res.status(200).json({ pickupRes });
  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};

exports.handlerDisablePickup = async (req, res) => {
  const pickupId = Number(req.params.pickup_id);
  try {
    const pickup = await getPickupById(pickupId);
    const { pickup_time_ids } = pickup;
    const promises = pickup_time_ids ? pickup_time_ids.map(
      (idx) => softDeletePickupTimeRecord(Number(idx))
    ) : [];
    promises.push(deletePickupRecord(pickupId));
    
    Promise.all(promises).then(() => {
      return res.status(200).json({ message: 'success' });
    }).catch((err) => {
      req.log.error(err);
      return res.status(500).json({ error: err });
    });

  } catch (error) {
    req.log.error(error);
    return res.status(500).json({ error: 'InternlError' });
  }
};
