module.exports = {
  PG_URL:
    process.env.PG_URL || process.env.DATABASE_URL ||
    'postgres://postgres:pass123@localhost:5432/perdiem',
  USERS_TABLE: 'per_users',
  STORES_TABLE: 'per_stores',
  PRODUCTS_TABLE: 'per_products',
  ORDERS_TABLE: 'per_orders',
  PICKUPS_TABLE: 'per_pickups',
  PICKUPS_TIME_TABLE: 'per_pickups_time',

  SUBSCRIPTIONS_TABLE: 'per_subscriptions',
  ADDONS_TABLE: 'per_addons',
  COUPONS_TABLE: 'per_coupons',
  STORES_SHIPPING_TABLE: 'per_stores_shipping',
  USERS_TYPES: {
    ADMIN: 'admin',
    PUBLIC: 'public',
    MERCHANT: 'merchant'
  },
  JWT_SECRET: process.env.JWT_SECRET || 'shh...',
  JWT_AUTH_EXPIRED: process.env.JWT_AUTH_EXPIRED || '1d',
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  COOKIE_EXPIRATION: process.env.COOKIE_EXPIRATION, // 14 days
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || 'SG.nokey',
  STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
  STRIPE_LIVE_SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
  IAM_ACCESS_KEY: process.env.IAM_ACCESS_KEY,
  IAM_SECRET_KEY: process.env.IAM_SECRET_KEY,
  BUCKET_NAME: process.env.BUCKET_NAME,
  EMAIL_TEMPLATES: {
    WELCOME_SHOPPER: 'd-b8455c51d95f46f5a5ba674e1c27b5ea',
    WELCOME_MERCHANT: 'd-3d4720f008484f058c701c961540eb0d',
    RESET_PASSWORD: 'd-b2cf7c5e0dfc4635b3b9bc8cceced90a',
    NEW_SUBSCRIPTION_MERCHANT: 'd-6c4c8da8de644dbfa2e42d5b339803d5',
    RECEIP: 'd-b4ff20ea133f4cf99259d2d0f97c7e53'
  }
};
