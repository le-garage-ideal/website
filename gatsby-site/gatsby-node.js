
const path = require(`path`);
const schema = 'allMongodbBmbu7Ynqra11Rqi';
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`xxxxx FIN DU BUILD GATSBY-NODE.JS xxxxx`)
}
exports.createPages = async function({ actions, graphql, reporter }) {
    const { data: brands } = await graphql(`query {
        allMongodbBmbu7Ynqra11RqiBrands {
            edges {
                node {
                    id,
                    name
                }
            }
        }
    }`);
    brands[schema + 'Brands'].edges.forEach(({ node: brand }) => {
      actions.createPage({
        path: `/models/${brand.name}`,
        component: path.resolve(`./src/templates/models.js`),
        context: { brand: brand.name },
      })
    });

    const { data: models } = await graphql(`query {
      allMongodbBmbu7Ynqra11RqiModels {
          edges {
              node {
                  id,
                  name,
                  brand {
                      name
                  }
              }
          }
      }
  }`);
  models[schema + 'Models'].edges.forEach(({ node: model }) => {
    actions.createPage({
      path: `/cars/${model.brand.name}/${model.name}`,
      component: path.resolve(`./src/templates/cars.js`),
      context: { brand: model.brand.name, model: model.name },
    })
  });

  const { data: cars } = await graphql(`query query {
    allMongodbBmbu7Ynqra11RqiCars {
    edges {
      node {
          id,
          variant,
          power,
          officialWeight, 
          weight,
          options,
          startYear,
          endYear,
          favcarsVariants { name, urls },
          model {
              brand {
                  name
              }
             name
          }
      }
    }
  }
}`);
cars[schema + 'Cars'].edges.forEach(({ node: car }) => {
  actions.createPage({
    path: `/car/${car.id}`,
    component: path.resolve(`./src/templates/car.js`),
    context: { car },
  })
});
}
