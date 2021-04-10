module.exports = {
  title: 'Per Diem | Build Subscription in 5 minutes',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || ''
    }
  ],
  script: [
    {
      hid: 'Stripe',
      src: 'https://js.stripe.com/v3/',
      type: 'text/javascript',
      defer: true
    }
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
};
