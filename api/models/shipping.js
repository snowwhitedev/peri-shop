const knex = require('knex')({
  client: 'pg'
});

const { runQuery } = require('../db/index');
const { STORES_SHIPPING_TABLE } = require('../../nuxt.config').privateRuntimeConfig;

exports.createShipping = async (payload) => {
  const sqlQuery = knex
    .insert(payload)
    .into(STORES_SHIPPING_TABLE)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.updateShipping = async (updateFields, storeShippingId) => {
  const sqlQuery = knex(STORES_SHIPPING_TABLE)
    .update(updateFields)
    .where('store_shipping_id', storeShippingId)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};

exports.getShippingByStore = async (storeId) => {
  const sqlQuery = knex(STORES_SHIPPING_TABLE)
    .select('*')
    .where('store_id', storeId)
    .orderBy('ui_order', 'desc')
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows;
};

exports.getPartialListOfShippingByStore = async (storeId, limit, offset) => {
  const sqlQuery = knex(STORES_SHIPPING_TABLE)
    .select('*')
    .where('store_id', storeId)
    .orderBy('ui_order', 'desc')
    .limit(limit)
    .offset(offset)
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows;
};

exports.getShippingById = async (shippingId) => {
  const sqlQuery = knex(STORES_SHIPPING_TABLE)
    .select('*')
    .where('store_shipping_id', shippingId)
    .returning('*')
    .toString();

  const response = await runQuery(sqlQuery);

  return response.rows[0];
};
