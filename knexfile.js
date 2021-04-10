// Update with your config settings.

module.exports = {

  development: {
    client: 'postgresql',
    connection: process.env.PG_URL || 'postgres://postgres:pass123@localhost:5432/perdiem',
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    debug: true
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL || process.env.PG_URL,
    pool: {
      min: 4,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations'
    },
    dialectOptions: {
      ssl: {
        // Ref.: https://github.com/brianc/node-postgres/issues/2009
        rejectUnauthorized: false
      },
      keepAlive: true
    },
    debug: true,
    ssl: process.env.NODE_ENV === 'production'
  }
};
