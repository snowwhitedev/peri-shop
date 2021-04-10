const { STORES_SHIPPING_TABLE } = require('../nuxt.config').privateRuntimeConfig;

/**
 *
 * Add column to order items on UI
 */
exports.up = function(knex) {
    return knex.schema.hasTable(STORES_SHIPPING_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(STORES_SHIPPING_TABLE, table => {
          table
            .integer('ui_order')
            .unsigned()
            .notNullable()
            .defaultTo(0);
        });
      }
    });
};

exports.down = function(knex) {
    return knex.schema.hasTable(STORES_SHIPPING_TABLE).then(exists => {
      if (exists) {
        return knex.schema.table(STORES_SHIPPING_TABLE, table => {
          table.dropColumn('ui_order');
        });
      }
    });
};
