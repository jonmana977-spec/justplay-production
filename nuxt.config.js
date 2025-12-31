import { resolve } from 'path'

export default {
  ssr: false,
  target: 'static',

  generate: {
    fallback: '200.html'
  },

  alias: {
    images: resolve(__dirname, './assets/images'),
    style: resolve(__dirname, './assets/style')
  },

  head() {
    return {
      title: 'Stream Free Movies & TV Shows',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: '//cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' },
        { rel: 'preconnect', href: '//fonts.googleapis.com' },
        { rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: '//fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap' }
      ]
    }
  },

  css: ['@/assets/style/app.css'],

  plugins: [
    '~/plugins/lodash.js',
    '~/plugins/infiniteloading.js'
  ],

  components: true,

  buildModules: ['@nuxtjs/moment'],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/i18n'
  ],

  axios: {
    baseURL: 'https://api.themoviedb.org/3'
  },

  i18n: {
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'lang/',
    defaultLocale: 'en',
    useCookie: true,
    locales: [
      { code: 'en', iso: 'en-US', file: 'en-US.js' },
      { code: 'id', iso: 'id-ID', file: 'id-ID.js' }
      // locale lain boleh ditambahkan kembali nanti
    ]
  },

  build: {
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  }
}
