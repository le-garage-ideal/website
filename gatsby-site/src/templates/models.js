import React, { useState } from "react";
import Uri from 'jsuri';
import { Layout } from "../components/layout";
import FilteredList from "../components/utils/filtered-list";
import ListItem from "../components/utils/list-item";
import { SEO } from "../components/seo/seo";
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { schema } from '../constants';


const Models = ({data, pageContext, location}) => {

    const uri = new Uri(location.href);
    const listName = data[schema + 'Cars'].edges
        .map(({node}) => node)
        .sort((a, b) => a.model.name === b.model.name ? 0 : a.model.name < b.model.name ? -1 : 1)
        .reduce((acc, el) => acc[acc.length-1] && acc[acc.length-1].model.name === el.model.name ? acc : [...acc, el], []);
    const [filteredModels, setFilteredModels] = useState(listName);

    const modelComponents = filteredModels.map(car => {
        return (
            <ListItem key={car.model.name}
                id={car.model.name}
                name={car.model.name}
                image={`/images/${car.mongodb_id}-resized.jpg`}
                big={true}
                onClick={() => {
                    uri.setPath(`/cars/${car.model.brand.name}/${car.model.name}`);
                    window.location.href = uri.toString();
                }}>
            </ListItem>
        )
    });

    const search = value => {
        const filtered = listName.filter(car => car.model.name.match(new RegExp(value, 'i')));
        setFilteredModels(filtered);
    };

    const title = `Modèles ${pageContext.brand}`;

    return (
        <Layout>
            <SEO location={location.pathname} title={title} />
            <FilteredList title={title} render={() => modelComponents} filter={search} />
        </Layout>
    );
}

Models.propTypes = {
    name: PropTypes.string
};

export default Models;

export const query = graphql`
  query ModelByBrand($brand: String) {
    allMongodbBmbu7Ynqra11RqiCars(filter: {model: {brand: {name: {eq: $brand}}}}) {
        edges {
            node {
                mongodb_id,
                model {
                    name,
                    brand {
                        name
                    }
                }
            }
        }
    }
  }
`

