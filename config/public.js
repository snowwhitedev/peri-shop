module.exports = {
  API_URL: process.env.API_URL,
  PERDIEM_DOMAIN: process.env.PERDIEM_DOMAIN,
  STRIPE_TEST_CONNECT_URL: 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_HOXidOExhLb1HZ68ippaXJkJlkpVhh2b&scope=read_write',
  STRIPE_LIVE_CONNECT_URL: 'https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=ca_HOXih4fSZ3H9aPCJuISaOYj690IzQ7xE&scope=read_write',
  STRIPE_TEST_PUBLISHABLE_KEY: process.env.STRIPE_TEST_PUBLISHABLE_KEY || 'pk_test_MpCmliZ00L1DFE6kKfE0BkGO00mf51mS9c',
  STRIPE_LIVE_PUBLISHABLE_KEY: process.env.STRIPE_LIVE_PUBLISHABLE_KEY,
  CDN_URL: process.env.CDN_URL || 'https://cdn.per-diem.co',
  SHIPPING_MODE: 'shipping',
  PICKUP_MODE: 'pickups',
  PRODUCTS_MODE: 'shares',
  ADDONS_MODE: 'addons',
  DELIVERY_PATH: '/delivery',
  SHARES_PATH: '/share',
  WELCOME_PATH: '/',
  SHIPPING_PATH: '/shipping'
};
