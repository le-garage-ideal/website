import React, { useState } from "react";
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import Layout from "../components/layout";
import FilteredList from "../components/utils/filtered-list";
import ListItem from "../components/utils/list-item";
import SEO from "../components/seo/seo";
import { schema } from '../constants';
import sortCars from '../functions/sort';

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
        const filtered = completeCarList.filter(car => car.variant.match(new RegExp(value, 'i')));
        setFilteredCars(filtered);
    };

    const title = `Variantes de ${pageContext.brand} ${pageContext.model}`;

    return (
        <Layout>
            <SEO location={location.pathname} title={title} />
            <h1>{title}</h1>
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
