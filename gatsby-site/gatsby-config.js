/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const path = require('path');
const { mongodbPassword } = require('./passwords');

module.exports = {
  plugins: [
    /*
    * Gatsby's data processing layer begins with “source” plugins. Here we
    * setup the site to pull data from the "documents" collection in a local
    * MongoDB instance
    */
    {
      resolve: 'gatsby-source-mongodb',
      options: {
        server: { address: 'bmbu7ynqra11rqi-mongodb.services.clever-cloud.com', port: '27017' },
        auth: { user: 'uepch5uqblw5mad6k1x1', password: mongodbPassword },
        dbName: 'bmbu7ynqra11rqi',
        collection: ['cars', 'models', 'brands'],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.join(__dirname, 'static'),
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-intl',
      options: {
        // language JSON resource path
        path: `${__dirname}/src/intl`,
        // supported language
        languages: ['en', 'fr'],
        // language file path
        defaultLanguage: 'en',
        // option to redirect to `/en` when connecting `/`
        redirect: true,
      },
    },
  ],
  siteMetadata: {
    url: 'https://perfect-garage.org', // No trailing slash allowed!
    image: '/logo.jpg', // Path to your image you placed in the 'static' folder
  },
};
