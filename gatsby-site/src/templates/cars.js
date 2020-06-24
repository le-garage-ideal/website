import React, { useState } from "react";
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import { FilteredList } from "../components/utils/filtered-list";
import ListItem from "../components/utils/list-item";
import { schema } from '../constants';
import Layout from "../components/layout";

const sortCars = (a, b) => {
    const sortField = (a, b, field) => {
        if (!a[field] && !b[field]) {
            return 0;
        }
        if (!a[field]) {
            return -1;
        }
        if (!b[field]) {
            return 1;
        }
        return a[field] < b[field] ? -1 : a[field] === b[field] ? 0 : 1;
    }; 
    return sortField(a, b, 'startYear') === 0 ? sortField(a, b, 'variant') : sortField(a, b, 'startYear');
};

export default ({data, pageContext, location}) => {
    const uri = new Uri(location.href);
    const completeCarList = data[schema + 'Cars'].edges.map(({node}) => node).sort(sortCars);
    const [filteredCars, setFilteredCars] = useState(completeCarList);
    

    const carComponents = filteredCars.map(car => {
        const imageUrl = `/images/${car.mongodb_id}.jpg`;
        return (
            <ListItem key={car.mongodb_id}
                id={car.mongodb_id}
                name={car.variant + (car.startYear ? ' - ' + car.startYear : '')}
                image={imageUrl}
                big={true}
                onClick={() => {
                    uri.addQueryParam('car', car.mongodb_id);
                    uri.setPath('/');
                    window.location.href = uri.toString();
                }}>
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
