const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const { PICKUPS_TABLE, PICKUPS_TIME_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.createPickup = async (payload) => {
  const sqlQuery = knex
    .insert(payload)
    .into(PICKUPS_TABLE)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.updatePickupRecord = async (pickupId, updateFields) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .update(updateFields)
    .where('pickup_id', parseInt(pickupId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.getPickupById = async (pickupId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where('pickup_id', parseInt(pickupId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  const pickup = response.rows[0];

  return pickup;
};

exports.getPickupWithTimeById = async (pickupId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where('pickup_id', parseInt(pickupId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  const pickup = response.rows[0];
  const pickup_time_ids = pickup.pickup_time_ids.map(time_id => Number(time_id));

  const timeSqlQuery = knex(PICKUPS_TIME_TABLE)
    .select('*')
    .whereIn('pickup_time_id', pickup_time_ids)
    .returning('*')
    .toString();
  const timeResponse = await runQuery(timeSqlQuery);
  pickup.pickup_times = timeResponse.rows;

  return pickup;
};

exports.deletePickupRecord = async (pickupId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .where({ pickup_id: pickupId })
    .del()
    .toString();

  const response = await runQuery(sqlQuery);
  return response;
};

exports.getListOfPickupsByStore = async (storeId, isActive = true) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where({ store_id: Number(storeId) })
    .andWhere({ is_active: isActive })
    .orderBy('ui_order', 'desc')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows || [];
};

exports.getListOfPickupsByStoreAndProductId = async (storeId, productId) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where({ store_id: Number(storeId) })
    .andWhere({ is_active: true })
    .andWhereRaw(`${productId} = ANY(product_ids)`)
    .orderBy('ui_order', 'desc')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows || [];
};

exports.getPartialListOfPickupsByStore = async (storeId, limit, offset) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where('store_id', parseInt(storeId))
    .orderBy('ui_order', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

exports.getListOfPickupsWithTimes = async (storeId, limit, offset) => {
  const sqlQuery = knex(PICKUPS_TABLE)
    .select('*')
    .where('store_id', parseInt(storeId))
    .orderBy('ui_order', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

/** * PICKUP TIMES ***/
exports.createPickupTimeRecord = async (payload) => {
  const sqlQuery = knex
    .insert(payload)
    .into(PICKUPS_TIME_TABLE)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.createBulkPickupTimeRecords = async (payload) => {
  const sqlQuery = knex
    .insert(payload)
    .into(PICKUPS_TIME_TABLE)
    .returning('pickup_time_id')
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows;
};

exports.upsertBulkPickupTimeRecords = async (payload) => {
  let sqlQuery = `${knex.insert(payload).into(PICKUPS_TIME_TABLE).toString()}`;
  sqlQuery = `
    ${sqlQuery} ON CONFLICT (pickup_time_id)
    DO UPDATE SET
    updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;
  const result = await runQuery(sqlQuery);
  return result.rows;
};

exports.updatePickupTimeRecord = async (pickupTimeId, updateFields) => {
  const sqlQuery = knex(PICKUPS_TIME_TABLE)
    .update(updateFields)
    .where('pickup_time_id', parseInt(pickupTimeId, 10))
    .returning('*')
    .toString();
  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.softDeletePickupTimeRecord = async (pickupTimeId) => {
  const sqlQuery = knex(PICKUPS_TIME_TABLE)
    .update({ is_active: false })
    .where({ pickup_time_id: pickupTimeId })
    .toString();

  const response = await runQuery(sqlQuery);
  return response.rows[0];
};

exports.deletePickupTimeRecord = async (pickupTimeId) => {
  const sqlQuery = knex(PICKUPS_TIME_TABLE)
    .where({ pickup_time_id: pickupTimeId })
    .del()
    .toString();

  const response = await runQuery(sqlQuery);
  return response;
};

exports.bulkDeletePickupTimeRecords = async (pkTimeIds) => {
  const sqlQuery = knex(PICKUPS_TIME_TABLE)
    .whereIn('pickup_time_id', pkTimeIds)
    .del()
    .toString();

  const response = await runQuery(sqlQuery);
  return response;
};
