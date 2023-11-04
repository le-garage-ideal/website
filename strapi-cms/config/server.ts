export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', 'http://0.0.0.0:1337/strapi/'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
