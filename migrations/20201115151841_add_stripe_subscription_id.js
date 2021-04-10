const { SUBSCRIPTIONS_TABLE } = require("../nuxt.config").privateRuntimeConfig;

/**
 *
 * Add stripe subscription id to each subscription if it exists
 */
exports.up = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.string("stripe_subscription_id");
      });
    }
  });
};

exports.down = function(knex) {
  return knex.schema.hasTable(SUBSCRIPTIONS_TABLE).then(exists => {
    if (exists) {
      return knex.schema.table(SUBSCRIPTIONS_TABLE, table => {
        table.dropColumn("stripe_subscription_id");
      });
    }
  });
};
