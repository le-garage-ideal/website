/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

    module.exports = {
      plugins: [
        /*
        * Gatsby's data processing layer begins with “source” plugins. Here we
        * setup the site to pull data from the "documents" collection in a local
        * MongoDB instance
        */
        {
          resolve: `gatsby-source-mongodb`,
          options: {
            server: { address: 'bmbu7ynqra11rqi-mongodb.services.clever-cloud.com', port: '27017' },
            auth: { user: 'uepch5uqblw5mad6k1x1', password: 'BN5Ufr4twpbJqZjdshDr'},
            dbName: 'bmbu7ynqra11rqi',
            collection: ['cars', 'models', 'brands']
          },
        },
        {
          resolve: `gatsby-plugin-sass`
        },
      ],
    }
