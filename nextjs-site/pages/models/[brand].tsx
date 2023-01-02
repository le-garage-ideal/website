import React, { useContext, useState } from 'react';
import Uri from 'jsuri';
import { sortModels } from '../../functions/sort';
import FilteredList from '../../app/components/utils/filtered-list';
import ListItem from '../../app/components/utils/list-item';
import { Layout } from '../../app/components/layout';
import { SEO } from '../../app/components/seo/seo';
import { extractRelativePathWithParams } from '../../functions/url';
import { I18nContext } from '../../functions/i18n';

const Models = ({ data, pageContext, location }) => {
  const i18n = useContext(I18nContext);

  const uri = new Uri(location.href);
  const listName = data.allMongodbBmbu7Ynqra11RqiCars.edges
    .map(({ node }) => node)
    .sort((a, b) => sortModels(a.model, b.model))
    .reduce((acc, el) => (
      acc[acc.length - 1] && acc[acc.length - 1].model.name === el.model.name ? acc : [...acc, el]
    ), []);
  const [filteredModels, setFilteredModels] = useState(listName);

  const modelComponents = filteredModels.map(car => (
    <li key={car.model.name}>
      <ListItem
        id={car.model.name}
        name={car.model.name}
        image={`/images/${car.id}-resized.jpg`}
        big
        onClick={() => {
          uri.setPath(`/cars/${car.model.brand.name}/${car.model.name}`);
          navigate(extractRelativePathWithParams(uri));
        }}
      />
    </li>
  ));

  const search = value => {
    const filtered = listName.filter(car => car.model.name.match(new RegExp(value, 'i')));
    setFilteredModels(filtered);
  };

  const title = i18n['templates.models.title' }, { brand: pageContext.brand });

  const description = i18n['templates.models.description' }, { brand: pageContext.brand });

  return (
    <Layout>
      <SEO
        uri={location.href}
        location={location.pathname}
        title={title}
        description={description}
      />
      <FilteredList title={title} filter={search}>
        {modelComponents}
      </FilteredList>
    </Layout>
  );
};

Models.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiCars: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            id: string;
            model: PropTypes.shape({
              id: string;
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
  }).isRequired,
};

export default Models;

export const query = graphql`
  query ModelByBrand($brand: String) {
    allMongodbBmbu7Ynqra11RqiCars(filter: {model: {brand: {name: {eq: $brand}}}}) {
        edges {
            node {
                id,
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
