
const path = require(`path`);
const schema = 'allMongodbBmbu7Ynqra11Rqi';
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`xxxxx FIN DU BUILD GATSBY-NODE.JS xxxxx`)
}
exports.createPages = async function({ actions, graphql, reporter }) {
    const { data } = await graphql(`query {
        allMongodbBmbu7Ynqra11RqiBrands {
            edges {
                node {
                    id,
                    name
                }
            }
        }
    }`);
    reporter.info(JSON.stringify(data[schema + 'Brands'].edges.map(obj => Object.keys(obj).join(';'))));
    data[schema + 'Brands'].edges.forEach(({ node }) => {
      actions.createPage({
        path: `/models/${node.id}`,
        component: path.resolve(`./src/templates/models.js`),
        context: { brand: node.id },
      })
    });
  }
