import React, { useState } from "react";
import { FilteredList } from "../components/utils/filtered-list";
import ListItem from "../components/utils/list-item";
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { schema } from '../constants';
import Layout from "../components/layout";


const Models = ({data, pageContext, location}) => {

    const listName = data[schema + 'Models'].edges;
    const [filteredModels, setFilteredModels] = useState(listName.map(({node}) => node));

    const modelComponents = filteredModels.map(model => {
        return (
            <ListItem key={model.id}
                id={model.id}
                name={model.name}
                image={null}
                onClick={() => window.location.href = `/cars/${model.brand.name}/${model.name}${location.search}`}>
            </ListItem>
        )
    });

    const search = value => {
        const filtered = data.filter(({ node: model }) => model.name.match(new RegExp(value, 'i')));
        setFilteredModels(filtered);
    };

    const title = `Modèles ${pageContext.brand}`;

    return (
        <Layout>
            <h1>{ title }</h1>
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
    allMongodbBmbu7Ynqra11RqiModels(filter: {brand: {name: {eq: $brand}}}) {
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
  }
`

