/**
 *
 * This migration will extend the existing pickup table to support multiple days and times to each pickup
 * The `per_pickup` table will host the products, and physical location but the time will be hosted
 * in a different table `per_pickups_time`
 *
 */

const { PICKUPS_TABLE, PICKUPS_TIME_TABLE } = require('../nuxt.config').privateRuntimeConfig;

exports.up = function (knex) {
  return knex.schema.table(PICKUPS_TABLE, (table) => {
    table.dropColumns(['days_of_week', 'day_of_week', 'start_time', 'end_time']);
    table.specificType('pickup_time_ids', 'character varying(64)[]').comment('pickup time ids reference from the pickups_time');
  })
    .then(() => {
    // Add the new table
      return knex.schema.hasTable(PICKUPS_TIME_TABLE).then((exists) => {
        if (!exists) {
          return knex.schema.createTable(PICKUPS_TIME_TABLE, (table) => {
            table.increments('pickup_time_id').primary();
            table.integer('store_id');
            table.string('start_time'); // HH:MM
            table.string('end_time'); // HH:MM
            table.string('name').comment('internal use');
            table.enu('day', [
              'sunday',
              'monday',
              'tuesday',
              'wednesday',
              'thursday',
              'friday',
              'saturday',
              'weekdays', // Mon-Fri
              'allweek', // Mon-Sun
              'weekends' // Saturday-Sunday
            ]).comment('Options');

            // this will let the user the ability to override the string in the shopping flow
            table.string('title').comment('Override the text for the day/s');

            table.boolean('is_active').defaultTo(true);

            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index('store_id');
          });
        }
      });
    });
};

exports.down = function (knex) {
  return Promise.all([
    knex.schema.hasTable(PICKUPS_TIME_TABLE).then((exists) => {
      if (exists) {
        return knex.dropTable(PICKUPS_TIME_TABLE);
      }
    }),
    knex.schema.table(PICKUPS_TABLE, (table) => {
      table.dropColumns(['pickup_time_ids']);
      table.string('start_time'); // HH:MM
      table.string('end_time'); // HH:MM
      table.enu('day_of_week', [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday']);
      table.jsonb('days_of_week');
    })
  ]);
};
