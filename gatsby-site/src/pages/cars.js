import React from "react";
import { graphql } from 'gatsby';
import Spec from "../components/car/spec";
import { schema } from '../constants';
import Layout from "../components/layout";


export default (data) => {

    const carNodes = data.pageResources.json.data[schema + 'Cars'].edges;
    const carComponents = carNodes.map(({ node }) => {
        return (
            <Spec key={node.mongodb_id}
                power={node.power}
                weight={node.weight}>
            </Spec>
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
