import React, { useState } from "react";
import { FilteredList } from "../components/utils/filtered-list";
import ListItem from "../components/utils/list-item";
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import { schema } from '../constants';


const Models = ({data}) => {

    const [selectedModel, setSelectedModel] = useState(null);
    const [filteredModels, setFilteredModels] = useState(data[schema + 'Models'].edges.map(({node}) => node));

    const modelComponents = filteredModels.map(model => {
        return (
            <ListItem key={model.id}
                id={model.id}
                name={model.name}
                image={null}
                onClick={() => setSelectedModel(model)}
                selected={selectedModel && selectedModel.id === model.id}>
            </ListItem>
        )
    });

    const search = value => {
        const filtered = data.filter(({ node: model }) => model.name.match(new RegExp(value, 'i')));
        setFilteredModels(filtered);
    };

    return (
        <FilteredList render={() => modelComponents} filter={search} />
    );
}

Models.propTypes = {
    name: PropTypes.string
};

export default Models;

export const query = graphql`
  query ModelByBrandId($brand: String) {
    allMongodbBmbu7Ynqra11RqiModels(filter: {brand: {name: {eq: $brand}}}) {
        edges {
            node {
                id,
                name
            }
        }
    }
  }
`

