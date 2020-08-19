
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
    
    const { data: cars } = await graphql(`query {
      allMongodbBmbu7Ynqra11RqiCars {
      edges {
        node {
            mongodb_id,
            variant,
            power,
            officialWeight, 
            weight,
            options,
            startYear,
            endYear,
            favcarsVariants { name, urls },
            selectedFavcarsUrl,
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


    brands[schema + 'Brands'].edges.forEach(({ node: brand }) => {
      
      actions.createPage({
        path: `/models/${brand.name}`,
        component: path.resolve(`./src/templates/models.js`),
        context: { brand: brand.name },
      })
    
    });

    models[schema + 'Models'].edges.forEach(({ node: model }) => {

      actions.createPage({
        path: `/cars/${model.brand.name}/${model.name}`,
        component: path.resolve(`./src/templates/cars.js`),
        context: { brand: model.brand.name, model: model.name },
      })

    });


    cars[schema + 'Cars'].edges.forEach(async ({ node: car }) => {

      // const images = await graphql(`
      //   query {
      //     allFile(filter: {relativePath: { eq: "images/${car._id}.jpg" }, extension: { eq: "jpg" }}) {
      //       edges {
      //         node {
      //           childImageSharp {
      //             # Specify the image processing specifications right in the query.
      //             # Makes it trivial to update as your page's design changes.
      //             fluid(maxWidth: 600, maxHeight: 350) {
      //                 ...GatsbyImageSharpFluid
      //             }
      //           }
      //         }
      //       }
      //     }
      //   }
      // `);
      
      // console.log(images);

      actions.createPage({
        path: `/car/${car.mongodb_id}`,
        component: path.resolve(`./src/templates/car.js`),
        context: { car/*, image: images.get(car._id)*/},
      })
    });
}
