import React from 'react';

type SEOProps = {
  uri: string | undefined;
  title: string;
  description: string;
};
export const SEO = ({
  uri,
  title,
  description,
}: SEOProps) => {

  return (
    <>
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />

      {uri && <meta property="og:url" content={uri} />}

      <meta property="og:type" content="website" />

      {title && <meta property="og:title" content={title} />}

      {description && (
        <meta property="og:description" content={description} />
      )}

      {title && <meta name="twitter:title" content={title} />}

      {description && (
        <meta name="twitter:description" content={description} />
      )}

      <link rel="icon" type="image/png" href="/logo.png" />
    </>
  );
};
