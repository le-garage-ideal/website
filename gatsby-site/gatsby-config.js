/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
const path = require(`path`)
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
        auth: { user: 'uepch5uqblw5mad6k1x1', password: 'BN5Ufr4twpbJqZjdshDr' },
        dbName: 'bmbu7ynqra11rqi',
        collection: ['cars', 'models', 'brands']
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: path.join(__dirname, `static`),
      },
    },
    {
      resolve: `gatsby-plugin-sass`
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-react-helmet`
  ],
  siteMetadata: {
    title: "Le Garage Idéal",
    titleTemplate: "%s · Le Garage Idéal",
    description:
      "Créez et partagez votre garage de rêve, en 3 voitures de sport.",
    url: "https://perfect-garage.org", // No trailing slash allowed!
    image: "/logo.jpg", // Path to your image you placed in the 'static' folder
  },
}
