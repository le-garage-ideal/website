import React from 'react';
import { Helmet } from 'react-helmet';

type SEOProps = {
  uri: string | undefined;
  title: string | undefined;
  description: string | undefined;
};
export const SEO = ({
  uri,
  title,
  description,
}: SEOProps) => {
  const seo = {
    title,
    description,
  };

  return (
    <Helmet title={seo.title} titleTemplate="%s">
      <meta name="description" content={seo.description} />

      {uri && <meta property="og:url" content={uri} />}

      <meta property="og:type" content="website" />

      {seo.title && <meta property="og:title" content={seo.title} />}

      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}

      {seo.title && <meta name="twitter:title" content={seo.title} />}

      {seo.description && (
        <meta name="twitter:description" content={seo.description} />
      )}

      <link rel="icon" type="image/png" href="/logo.png" />
    </Helmet>
  );
};
