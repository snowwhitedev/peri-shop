module.exports = {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: require('./config/head'),
  server: require('./config/server'),
  /*
   ** Global CSS
   */
  css: ['@/assets/css/tailwind.css', '@/assets/scss/main.scss'],
  generate: {
    fallback: true
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/analytics.js', mode: 'client' },
    {
      src: '~/plugins/vuex-persist',
      mode: 'client'
    }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/fontawesome',
    '@nuxtjs/tailwindcss'
  ],
  fontawesome: require('./config/fontawesome'),
  buefy: {
    materialDesignIcons: false,
    defaultIconPack: 'fas',
    defaultIconComponent: 'font-awesome-icon'
  },
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // https://github.com/dansmaculotte/nuxt-segment
    '@dansmaculotte/nuxt-segment'
  ],
  segment: {
    writeKey: 'tFxDsGlTB1fMCmTrpejuqVstBWO1IqvG',
    disabled: process.env.NODE_ENV === 'production',
    useRouter: true
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000/api'
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: require('./config/build'),

  serverMiddleware: ['~/api/index.js'],

  publicRuntimeConfig: require('./config/public'),
  privateRuntimeConfig: require('./config/private')
};
