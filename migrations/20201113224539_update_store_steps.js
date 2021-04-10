const { STORES_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.hasTable(STORES_TABLE).then((exists) => {
    if (exists) {
      return knex.schema.alterTable(STORES_TABLE, (table) => {
        // based on the category we know which photos to show
        table.string('category').alter();
        table.jsonb('steps').defaultTo(
          JSON.stringify([
            {
              type: 'products',
              order: 1,
              icon: 'shopping-bag',
              icon_title: 'Subscriptions',
              active: true,
              title: 'Select a Subscription',
              sub_title: 'Choose a plan that works for you.'
            },
            {
              type: 'addons',
              order: 2,
              icon: 'cart-plus',
              icon_title: 'Addons',
              active: false,
              title: 'Addons',
              sub_title: 'Select the addons available for your product.'
            },
            {
              type: 'pickup',
              order: 3,
              icon: 'map-marker-alt',
              icon_title: 'Pickups',
              active: true,
              title: 'Time and Place',
              sub_title: 'Select a time and place that works for you.'
            },
            {
              type: 'shipping',
              order: 4,
              icon: 'map-marker-alt',
              icon_title: 'Shipping',
              active: false,
              title: 'Shipping',
              sub_title: 'No need to pick it up we can send it to you'
            },
            {
              type: 'checkout',
              order: 5,
              icon: 'cash-register',
              icon_title: 'Checkout',
              active: true,
              title: 'Checkout',
              sub_title: 'Thanks for letting us take care of you.'
            }
          ])
        ).alter();
      });
    }
  });
};

exports.down = function (knex) {
  return knex.schema.hasTable(STORES_TABLE).then((exists) => {
    if (exists) {
      return knex.schema.table(STORES_TABLE, (table) => {
        table.dropColumn('steps');
      });
    }
  });
};
