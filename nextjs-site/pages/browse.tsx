import React, { useState } from 'react';

import Uri from 'jsuri';

import { useIntl, navigate } from 'gatsby-plugin-react-intl';
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import { extractRelativePathWithParams } from '../functions/url';
import './bulma-theme.scss';

const Browse = ({ data, location }) => {
  const i18n = useContext(I18nContext);
  const uri = new Uri(location.href);

  const onBrandSelect = brandName => {
    uri.setPath(`/models/${brandName}`);
    navigate(extractRelativePathWithParams(uri));
  };

  const [filteredBrands, setFilteredBrands] = useState(data.allMongodbBmbu7Ynqra11RqiBrands.edges);

  const brandComponents = filteredBrands.map(({ node: brand }) => brand)
    .sort((brand1, brand2) => (brand1.name > brand2.name ? 1 : -1))
    .map(brand => (
      <li key={brand.id}>
        <ListItem
          id={brand.id}
          name={brand.name}
          image={brand.image}
          onClick={() => onBrandSelect(brand.name)}
        />
      </li>
    ));

  const search = value => {
    const filtered = data.allMongodbBmbu7Ynqra11RqiBrands.edges
      .filter(({ node: brand }) => brand.name.match(new RegExp(value, 'i')));
    setFilteredBrands(filtered);
  };

  return (
    <Layout uri={uri.toString()}>
      <SEO
        uri={location.href}
        location={location.pathname}
        title={i18n['pages.browse.meta.title']}
        description={i18n['pages.browse.meta.description']}
      />
      <FilteredList
        title={i18n['pages.browse.list_title']}
        filter={search}
      >
        {brandComponents}
      </FilteredList>
    </Layout>
  );
};

Browse.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiBrands: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            name: string;
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    href: string;
    pathname: string;
  }).isRequired,
};

export const query = graphql`query {
    allMongodbBmbu7Ynqra11RqiBrands {
        edges {
            node {
                name,
                image,
                id,
            }
        }
    }
}`;

export default Browse;
