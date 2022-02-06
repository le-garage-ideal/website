import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Uri from 'jsuri';
import { useIntl, navigate } from 'gatsby-plugin-react-intl';
import { graphql } from 'gatsby';
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import { sortCars } from '../functions/sort';
import { extractRelativePathWithParams } from '../functions/url';

const Cars = ({ data, pageContext, location }) => {
  const intl = useIntl();

  const uri = new Uri(location.href);
  const completeCarList = data.allMongodbBmbu7Ynqra11RqiCars.edges.map(({ node }) => node).sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);

  const carComponents = filteredCars.map(car => {
    const imageUrl = `/images/${car.mongodb_id}-resized.jpg`;
    return (
      <ListItem
        key={car.mongodb_id}
        id={car.mongodb_id}
        name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
        image={imageUrl}
        big
        onClick={() => {
          uri.addQueryParam('car', car.mongodb_id);
          uri.setPath('/');
          navigate(extractRelativePathWithParams(uri));
        }}
      />
    );
  });

  const search = value => {
    const filtered = completeCarList.filter(car => car.variant.match(new RegExp(value, 'i')));
    setFilteredCars(filtered);
  };

  const title = intl.formatMessage({ id: 'templates.cars.title' },
    { brand: pageContext.brand, model: pageContext.model },
  );

  const description = intl.formatMessage({ id: 'templates.cars.description' },
    { brand: pageContext.brand, model: pageContext.model },
  );

  return (
    <Layout>
      <SEO
        uri={location.href}
        location={location.pathname}
        title={title}
        description={description}
      />
      <FilteredList title={title} render={() => carComponents} filter={search} />
    </Layout>
  );
};

Cars.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            mongodb_id: PropTypes.string.isRequired,
            variant: PropTypes.string.isRequired,
            startYear: PropTypes.string,
            model: PropTypes.shape({
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

export const query = graphql`
    query CarsByModel($brand: String, $model: String) {
        allMongodbBmbu7Ynqra11RqiCars(filter: {model: {name: {eq: $model}, brand: { name: {eq: $brand}}}}) {
        edges {
          node {
              mongodb_id,
              variant,
              startYear,
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

export default Cars;
