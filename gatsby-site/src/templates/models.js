import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'gatsby';
import Uri from 'jsuri';
import { useIntl } from 'gatsby-plugin-intl';
import { sortModels } from '../functions/sort';
import { Layout } from '../components/layout';
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import { SEO } from '../components/seo/seo';

const Models = ({ data, pageContext, location }) => {
  const intl = useIntl();

  const uri = new Uri(location.href);
  const listName = data.allMongodbBmbu7Ynqra11RqiCars.edges
    .map(({ node }) => node)
    .sort((a, b) => sortModels(a.model, b.model))
    .reduce((acc, el) => (
      acc[acc.length - 1] && acc[acc.length - 1].model.name === el.model.name ? acc : [...acc, el]
    ), []);
  const [filteredModels, setFilteredModels] = useState(listName);

  const modelComponents = filteredModels.map(car => (
    <ListItem
      key={car.model.name}
      id={car.model.name}
      name={car.model.name}
      image={`/images/${car.mongodb_id}-resized.jpg`}
      big
      onClick={() => {
        uri.setPath(`/cars/${car.model.brand.name}/${car.model.name}`);
        window.location.href = uri.toString();
      }}
    />
  ));

  const search = value => {
    const filtered = listName.filter(car => car.model.name.match(new RegExp(value, 'i')));
    setFilteredModels(filtered);
  };

  const title = intl.formatMessage({ id: 'templates.models.title', values: { brand: pageContext.brand } });

  const description = intl.formatMessage({ id: 'templates.models.description', values: { brand: pageContext.brand } });

  return (
    <Layout>
      <SEO
        uri={location.href}
        location={location.pathname}
        title={title}
        description={description}
      />
      <FilteredList title={title} render={() => modelComponents} filter={search} />
    </Layout>
  );
};

Models.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            mongodb_id: PropTypes.string.isRequired,
            model: PropTypes.shape({
              mongodb_id: PropTypes.string.isRequired,
              brand: PropTypes.shape({
                name: PropTypes.string.isRequired,
              }),
              name: PropTypes.string.isRequired,
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    href: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  pageContext: PropTypes.shape({
    brand: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
  }).isRequired,
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
`;
