import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Uri from 'jsuri';
import { graphql } from 'gatsby';
import { useIntl, navigate } from 'gatsby-plugin-react-intl';
import FilteredList from '../components/utils/filtered-list';
import ListItem from '../components/utils/list-item';
import { Layout } from '../components/layout';
import { SEO } from '../components/seo/seo';
import { extractRelativePathWithParams } from '../functions/url';
import './bulma-theme.scss';

const Browse = ({ data, location }) => {
  const intl = useIntl();
  const uri = new Uri(location.href);

  const onBrandSelect = brandName => {
    uri.setPath(`/models/${brandName}`);
    navigate(extractRelativePathWithParams(uri));
  };

  const [filteredBrands, setFilteredBrands] = useState(data.allMongodbBmbu7Ynqra11RqiBrands.edges);

  const brandComponents = filteredBrands.map(({ node: brand }) => brand)
    .sort((brand1, brand2) => (brand1.name > brand2.name ? 1 : -1))
    .map(brand => (
      <li key={brand.mongodb_id}>
        <ListItem
          id={brand.mongodb_id}
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
        title={intl.formatMessage({ id: 'pages.browse.meta.title' })}
        description={intl.formatMessage({ id: 'pages.browse.meta.description' })}
      />
      <FilteredList
        title={intl.formatMessage({ id: 'pages.browse.list_title' })}
        render={() => brandComponents}
        filter={search}
      />
    </Layout>
  );
};

Browse.propTypes = {
  data: PropTypes.shape({
    allMongodbBmbu7Ynqra11RqiBrands: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            name: PropTypes.string.isRequired,
          }).isRequired,
        }).isRequired,
      ).isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    href: PropTypes.string.isRequired,
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export const query = graphql`query {
    allMongodbBmbu7Ynqra11RqiBrands {
        edges {
            node {
                name,
                image,
                mongodb_id,
            }
        }
    }
}`;

export default Browse;
