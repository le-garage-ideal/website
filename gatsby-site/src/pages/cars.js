import React from "react";
import { graphql } from 'gatsby';
import Car from "../components/car/car";
import { schema } from '../constants';
import Layout from "../components/layout";


export default (data) => {

    const carNodes = data.pageResources.json.data[schema + 'Cars'].edges;
    const carComponents = carNodes.map(({ node }) => {
        return (
            <Car key={node.mongodb_id}
                id={node.mongodb_id}
                variant={node.variant}
                power={node.power}
                weight={node.weight}
                startYear={node.startYear}
                endYear={node.endYear}
                brand={node.model.brand.name}
                model={node.model.name}>
            </Car>
        )
    });
    return (
        <Layout>
            <main className="appContainer">
                <section className="car-content">{ carComponents } </section>
            </main>
        </Layout>
    );
};

export const query = graphql`
    query {
        allMongodbBmbu7Ynqra11RqiCars(limit: 10) {
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
              model {
                  brand {
                      name
                  }
                 name
              }
          }
        }
      }
    }`;
