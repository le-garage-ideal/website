import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        siteUrl: url
        defaultImage: image
      }
    }
  }
`;

export const SEO = ({
  uri,
  title,
  description,
  image,
}) => {
  const { site } = useStaticQuery(query);

  const {
    siteUrl,
    defaultImage,
  } = site.siteMetadata;

  const seo = {
    title,
    description,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${uri || ''}`,
  };

  return (
    <Helmet title={seo.title} titleTemplate="%s">
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      {seo.url && <meta property="og:url" content={seo.url} />}

      <meta property="og:type" content="website" />

      {seo.title && <meta property="og:title" content={seo.title} />}

      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}

      {seo.image && <meta property="og:image" content={seo.image} />}

      {seo.title && <meta name="twitter:title" content={seo.title} />}

      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}

      {seo.image && <meta name="twitter:image" content={seo.image} />}

      <link rel="icon" type="image/png" href="/logo.png" />
    </Helmet>
  );
};

SEO.propTypes = {
  uri: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
};

SEO.defaultProps = {
  image: null,
};
