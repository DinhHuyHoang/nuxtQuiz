import colors from 'vuetify/es5/util/colors';
import myRouters from './config/router';
import myHead from './config/head';

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: myHead,
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/axios',
    '~/plugins/sanitize',
    '~/plugins/client'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'nuxt-socket-io'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },

        light: {
          primary: '#b40002',
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.darken4,
          error: colors.deepOrange.accent4,
          success: colors.green.darken2
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, { isClient }) {
      config.node = {
        fs: 'empty'
      };

      if (isClient) {
        // config.devtool = 'source-map';
        config.optimization.splitChunks.maxSize = 200000;
      }
    }
  },
  router: {
    base: '/etest',
    mode: 'history',
    middleware: [],
    extendRoutes(routes, resolve) {
      routes.splice(
        0,
        routes.length,
        ...myRouters.map(route => ({ ...route, component: resolve(__dirname, route.component) }))
      );
    }
  },

  io: {
    sockets: [
      {
        name: 'home',
        url: 'http://118.69.126.39:3333',
        default: true
      },

      {
        name: 'test',
        url: 'http://127.0.0.1:3333'
      }
    ]
  }
};
