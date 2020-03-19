import React from "react";
import { graphql } from 'gatsby';
import Car from "../components/car/car";
import { schema } from '../constants';


export default (data) => {

    const carNodes = data.pageResources.json.data[schema + 'Cars'].edges;
    const carComponents = carNodes.map(({ node }) => {
        console.log(node);
        return (
            <Car key={node.id}
                id={node.id}
                variant={node.variant}
                power={node.power}
                weight={node.weight}
                startYear={node.startYear}
                endYear={node.endYear}
                brand={node.model.brand.name}
                model={node.model.name}
                imageUrl={node.imageUrl}>
            </Car>
        )
    });
    return (
        <main className="app-container">
            <section>{ }</section>
            <section className="car-content">{ carComponents } </section>
        </main>
    );
};

export const query = graphql`query {
    allMongodbBmbu7Ynqra11RqiCars(limit: 10) {
        edges {
          node {
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
