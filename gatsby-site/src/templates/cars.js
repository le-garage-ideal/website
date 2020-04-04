import React, { useState } from "react";
import { graphql } from 'gatsby';
import { FilteredList } from "../components/utils/filtered-list";
import ListItem from "../components/utils/list-item";
import { schema } from '../constants';
import Layout from "../components/layout";


export default ({data, pageContext, location}) => {
    const listName = data[schema + 'Cars'].edges;
    const [filteredCars, setFilteredCars] = useState(listName.map(({node}) => node));

    const carComponents = filteredCars.map(car => {
        return (
            <ListItem key={car.id}
                id={car.id}
                name={car.variant}
                image={null}
                onClick={() => window.location.href = `/${location.search}&car=${car.id}`}>
            </ListItem>
        )
    });
    
    const search = value => {
        const filtered = data.filter(({ node: car }) => car.name.match(new RegExp(value, 'i')));
        setFilteredCars(filtered);
    };

    const title = `Variantes ${pageContext.brand} ${pageContext.model}`;

    return (
        <Layout>
            <h1></h1>
            <FilteredList title={title} render={() => carComponents} filter={search} />
        </Layout>
    );

};

export const query = graphql`
    query CarsByModel($brand: String, $model: String) {
        allMongodbBmbu7Ynqra11RqiCars(filter: {model: {name: {eq: $model}, brand: { name: {eq: $brand}}}}) {
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
