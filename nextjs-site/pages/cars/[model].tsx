import React, { useContext, useState } from 'react';
import Uri from 'jsuri';
import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { Layout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { sortCars } from '../../functions/sort';
import { extractRelativePathWithParams } from '../../functions/url';
import { I18nContext } from '../../functions/i18n';

const Cars = ({ data, pageContext, location }) => {
  const i18n = useContext(I18nContext);

  const uri = new Uri(location.href);
  const completeCarList = data.allMongodbBmbu7Ynqra11RqiCars.edges.map(({ node }) => node).sort(sortCars);
  const [filteredCars, setFilteredCars] = useState(completeCarList);

  const carComponents = filteredCars.map(car => {
    const imageUrl = `/images/${car.id}-resized.jpg`;
    return (
      <li key={car.id}>
        <ListItem
          id={car.id}
          name={car.variant + (car.startYear ? ` - ${car.startYear}` : '')}
          image={imageUrl}
          big
          onClick={() => {
            uri.addQueryParam('car', car.id);
            uri.setPath('/');
            navigate(extractRelativePathWithParams(uri));
          }}
        />
      </li>
    );
  });

  const search = value => {
    const filtered = completeCarList.filter(car => car.variant.match(new RegExp(value, 'i')));
    setFilteredCars(filtered);
  };

  const title = i18n['templates.cars.title' },
    { brand: pageContext.brand, model: pageContext.model },
  );

  const description = i18n['templates.cars.description' },
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
      <FilteredList title={title} filter={search}>
        {carComponents}
      </FilteredList>
    </Layout>
  );
};

Cars.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: string;
            variant: string;
            startYear?: string;
            model: PropTypes.shape({
              brand: PropTypes.shape({
                name: string;
              }),
              name: string;
            }).isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }).isRequired,
  }).isRequired,
  location: PropTypes.shape({
    href: string;
    pathname: string;
  }).isRequired,
  pageContext: PropTypes.shape({
    brand: string;
    model: string;
  }).isRequired,
};

export const query = graphql`
    query CarsByModel($brand: String, $model: String) {
        allMongodbBmbu7Ynqra11RqiCars(filter: {model: {name: {eq: $model}, brand: { name: {eq: $brand}}}}) {
        edges {
          node {
              id,
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
